/**
 * PedalPal Bike Catalog & Details Controller (js/bikes.js)
 * Manages bike card rendering, search, multi-attribute filtering,
 * sorting, and dynamic bike detail loading.
 */

const Bikes = (function () {
  function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  function getImgPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  function renderBikeCard(bike) {
    const isSaved = PedalPalStorage.isInWishlist(bike.id);
    const prefix = getPathPrefix();
    const imgPrefix = getImgPrefix();

    const evBadge = bike.fuelType === 'Electric'
      ? `<span class="badge-status status-confirmed"><i class="bi bi-lightning-charge-fill text-success"></i> ${bike.mileageOrRange}</span>`
      : `<span class="badge-status status-requested"><i class="bi bi-fuel-pump-fill text-warning"></i> ${bike.mileageOrRange}</span>`;

    const availBadge = bike.isAvailable
      ? `<span class="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill">Available</span>`
      : `<span class="badge bg-danger-subtle text-danger fw-bold px-2 py-1 rounded-pill">Booked</span>`;

    return `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="pedal-card bike-card">
          <div class="bike-card-img-wrap">
            <img src="${imgPrefix + bike.image}" alt="${bike.name}" loading="lazy">
            <div class="bike-card-badge-top-left">
              ${availBadge}
            </div>
            <button type="button" class="bike-card-wishlist-btn ${isSaved ? 'active' : ''}" data-id="${bike.id}" title="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}">
              <i class="bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
          </div>

          <div class="bike-card-body">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-1">
                <span class="badge bg-secondary-subtle text-dark fw-bold">${bike.category}</span>
                <span class="text-warning fw-bold"><i class="bi bi-star-fill"></i> ${bike.rating} (${bike.reviewCount})</span>
              </div>

              <h4 class="fw-bold mb-1 text-truncate" title="${bike.name}">${bike.name}</h4>
              <p class="text-muted small mb-2"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${bike.location}</p>

              <div class="d-flex flex-wrap gap-1 mb-2">
                ${evBadge}
                <span class="bike-spec-pill"><i class="bi bi-gear-fill"></i> ${bike.transmission}</span>
                <span class="bike-spec-pill"><i class="bi bi-shield-check text-success"></i> Helmet</span>
              </div>

              <div class="price-box-compact">
                <div class="d-flex justify-content-between align-items-baseline">
                  <div>
                    <span class="price-val">₹${bike.pricePerDay}</span>
                    <span class="text-muted small fw-bold">/ day</span>
                  </div>
                  <span class="text-secondary small fw-bold">₹${bike.pricePerHour}/hr</span>
                </div>
                <div class="text-muted small mt-1">
                  Safety deposit: <strong>₹${bike.securityDeposit}</strong> (100% returned)
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-2">
              <a href="${prefix}bike-details.html?id=${bike.id}" class="btn btn-pedal-outline w-50">
                <i class="bi bi-info-circle"></i> Details
              </a>
              <a href="${prefix}booking.html?id=${bike.id}" class="btn btn-pedal-accent w-50 ${!bike.isAvailable ? 'disabled' : ''}">
                <i class="bi bi-calendar-check"></i> Book
              </a>
            </div>

            <button type="button" class="btn btn-sm btn-link text-muted mt-2 p-0 text-decoration-none btn-add-compare" data-id="${bike.id}">
              <i class="bi bi-arrow-left-right"></i> Add to Compare
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return {
    renderGrid(containerId, filters = {}, sortOption = 'default') {
      const $container = $(containerId);
      if (!$container.length) return;

      let bikes = PedalPalStorage.getBikes(filters);

      // Sorting
      if (sortOption === 'price_asc') {
        bikes.sort((a, b) => a.pricePerDay - b.pricePerDay);
      } else if (sortOption === 'price_desc') {
        bikes.sort((a, b) => b.pricePerDay - a.pricePerDay);
      } else if (sortOption === 'rating') {
        bikes.sort((a, b) => b.rating - a.rating);
      } else if (sortOption === 'trips') {
        bikes.sort((a, b) => b.totalTrips - a.totalTrips);
      }

      $container.empty();

      if (bikes.length === 0) {
        $container.html(`
          <div class="col-12">
            <div class="empty-state-card">
              <div class="empty-state-icon"><i class="bi bi-bicycle"></i></div>
              <h4 class="fw-bold">No Bikes Match Your Filters</h4>
              <p class="text-muted">Try clearing some filter options or choosing a different location in Pune.</p>
              <button class="btn btn-pedal-primary" id="btnResetFilters">
                <i class="bi bi-arrow-counterclockwise"></i> Reset All Filters
              </button>
            </div>
          </div>
        `);
        return;
      }

      bikes.forEach(bike => {
        $container.append(renderBikeCard(bike));
      });

      // Update count text if element exists
      const $countEl = $('#bikeResultsCount');
      if ($countEl.length) {
        $countEl.text(`${bikes.length} bikes available in Pune`);
      }
    },

    loadBikeDetails(bikeId) {
      const bike = PedalPalStorage.getBikeById(bikeId);
      if (!bike) {
        $('#bikeDetailsContent').html(`
          <div class="empty-state-card my-5">
            <div class="empty-state-icon"><i class="bi bi-exclamation-triangle"></i></div>
            <h4 class="fw-bold">Bike Not Found</h4>
            <p class="text-muted">The requested vehicle listing could not be found or has been removed.</p>
            <a href="bikes.html" class="btn btn-pedal-primary"><i class="bi bi-arrow-left"></i> Back to Explore Bikes</a>
          </div>
        `);
        return;
      }

      const imgPrefix = getImgPrefix();
      const prefix = getPathPrefix();
      const owner = PedalPalStorage.getUserById(bike.ownerId) || { name: "Suresh Deshmukh", isVerified: true, badge: "Verified Owner", phone: "9822012345" };
      const reviews = PedalPalStorage.getReviews(bike.id);

      // Populate details page DOM elements
      $('#detailBikeName').text(bike.name);
      $('#detailBikeCategory').text(bike.category);
      $('#detailBikeRating').html(`★ ${bike.rating} <span class="text-muted">(${bike.reviewCount} customer reviews)</span>`);
      $('#detailBikeLocation').html(`<i class="bi bi-geo-alt-fill text-danger me-1"></i>${bike.location}`);
      $('#detailMainImage').attr('src', imgPrefix + bike.image).attr('alt', bike.name);

      // Specs
      $('#specBrand').text(bike.brand);
      $('#specModel').text(bike.model);
      $('#specRegNumber').text(bike.registrationNumber);
      $('#specFuel').text(bike.fuelType);
      $('#specTransmission').text(bike.transmission);
      $('#specYear').text(bike.manufacturingYear);
      $('#specMileage').text(bike.mileageOrRange);
      $('#specSeating').text(`${bike.seatingCapacity} Persons`);

      // Prices
      $('#detailPriceDay').text(`₹${bike.pricePerDay}`);
      $('#detailPriceHour').text(`₹${bike.pricePerHour}`);
      $('#detailPriceWeek').text(`₹${bike.pricePerWeek}`);
      $('#detailDeposit').text(`₹${bike.securityDeposit}`);

      // Description & Features
      $('#detailDescription').text(bike.description);
      const $featuresList = $('#detailFeaturesList');
      $featuresList.empty();
      if (bike.features) {
        bike.features.forEach(f => {
          $featuresList.append(`<li class="mb-2 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> <span class="fw-bold">${f}</span></li>`);
        });
      }

      // Owner Info
      $('#detailOwnerName').text(owner.name);
      $('#detailOwnerBadge').text(owner.badge || "Verified Owner");
      $('#detailOwnerPhone').text("+91 " + owner.phone);

      // Action buttons
      $('#detailBookBtn').attr('href', `${prefix}booking.html?id=${bike.id}`);
      if (!bike.isAvailable) {
        $('#detailBookBtn').addClass('disabled').text('Currently Booked');
      }

      $('#detailCompareBtn').attr('data-id', bike.id);

      // Render Reviews
      const $revContainer = $('#detailReviewsContainer');
      $revContainer.empty();
      if (reviews.length === 0) {
        $revContainer.html('<p class="text-muted">No reviews yet. Be the first to ride and review!</p>');
      } else {
        reviews.forEach(r => {
          $revContainer.append(`
            <div class="p-3 bg-light rounded-4 mb-3 border">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-dark">${r.customerName}</span>
                <span class="text-warning">★ ${r.rating}/5</span>
              </div>
              <small class="text-muted d-block mb-2">${r.date}</small>
              <p class="mb-0 text-secondary fs-6">${r.comment}</p>
            </div>
          `);
        });
      }

      // Similar bikes in same category
      const similar = PedalPalStorage.getBikes({ category: bike.category }).filter(b => b.id !== bike.id).slice(0, 3);
      const $similarContainer = $('#similarBikesGrid');
      $similarContainer.empty();
      similar.forEach(b => {
        $similarContainer.append(renderBikeCard(b));
      });
    }
  };
})();

window.PedalPalBikes = Bikes;
