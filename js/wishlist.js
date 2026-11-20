/**
 * PedalPal Wishlist Controller (js/wishlist.js)
 */

const Wishlist = (function () {
  function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  function getImgPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  return {
    renderWishlistGrid(containerId) {
      const $container = $(containerId);
      if (!$container.length) return;

      const wishlistIds = PedalPalStorage.getWishlist();
      const bikes = wishlistIds.map(id => PedalPalStorage.getBikeById(id)).filter(b => b !== null);
      const prefix = getPathPrefix();
      const imgPrefix = getImgPrefix();

      $container.empty();

      if (bikes.length === 0) {
        $container.html(`
          <div class="col-12">
            <div class="empty-state-card my-5">
              <div class="empty-state-icon"><i class="bi bi-heart"></i></div>
              <h4 class="fw-bold">Your Wishlist is Empty</h4>
              <p class="text-muted">Save your favorite bikes and scooters while browsing so you can book them anytime.</p>
              <a href="${prefix}bikes.html" class="btn btn-pedal-primary"><i class="bi bi-bicycle"></i> Explore Bikes in Pune</a>
            </div>
          </div>
        `);
        return;
      }

      bikes.forEach(bike => {
        const cardHtml = `
          <div class="col-12 col-md-6 col-lg-4 mb-4" id="wishlist-item-${bike.id}">
            <div class="pedal-card bike-card">
              <div class="bike-card-img-wrap">
                <img src="${imgPrefix + bike.image}" alt="${bike.name}" loading="lazy">
                <button type="button" class="bike-card-wishlist-btn active btn-remove-wishlist" data-id="${bike.id}" title="Remove from wishlist">
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              <div class="bike-card-body">
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <span class="badge bg-secondary-subtle text-dark fw-bold">${bike.category}</span>
                    <span class="text-warning fw-bold">★ ${bike.rating}</span>
                  </div>
                  <h4 class="fw-bold mb-1">${bike.name}</h4>
                  <p class="text-muted small mb-2"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${bike.location}</p>

                  <div class="price-box-compact">
                    <div class="d-flex justify-content-between align-items-baseline">
                      <span class="price-val">₹${bike.pricePerDay}</span>
                      <span class="text-muted small fw-bold">/ day</span>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-2">
                  <a href="${prefix}bike-details.html?id=${bike.id}" class="btn btn-pedal-outline w-50">
                    <i class="bi bi-info-circle"></i> Details
                  </a>
                  <a href="${prefix}booking.html?id=${bike.id}" class="btn btn-pedal-accent w-50 ${!bike.isAvailable ? 'disabled' : ''}">
                    <i class="bi bi-calendar-check"></i> Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        $container.append(cardHtml);
      });
    }
  };
})();

window.PedalPalWishlist = Wishlist;
