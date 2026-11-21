/**
 * PedalPal Bike Comparison Controller (js/comparison.js)
 * Compares up to 3 bikes side-by-side with clear differentiation.
 */

const Comparison = (function () {
  function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  function getImgPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  return {
    renderComparisonMatrix(containerId) {
      const $container = $(containerId);
      if (!$container.length) return;

      const compareIds = PedalPalStorage.getCompareList();
      const bikes = compareIds.map(id => PedalPalStorage.getBikeById(id)).filter(b => b !== null);
      const prefix = getPathPrefix();
      const imgPrefix = getImgPrefix();

      if (bikes.length === 0) {
        $container.html(`
          <div class="empty-state-card my-5">
            <div class="empty-state-icon"><i class="bi bi-arrow-left-right"></i></div>
            <h4 class="fw-bold">No Bikes Selected for Comparison</h4>
            <p class="text-muted">Browse our bike catalog and tap "Add to Compare" on any 2 or 3 bikes to inspect them side by side.</p>
            <a href="${prefix}bikes.html" class="btn btn-pedal-primary"><i class="bi bi-search"></i> Explore Bikes</a>
          </div>
        `);
        return;
      }

      let headerCols = '';
      let priceCols = '';
      let depositCols = '';
      let catCols = '';
      let fuelCols = '';
      let transCols = '';
      let rangeCols = '';
      let seatCols = '';
      let ratingCols = '';
      let locCols = '';
      let actionCols = '';

      bikes.forEach(bike => {
        headerCols += `
          <th style="min-width: 240px; text-align: center;">
            <div class="position-relative">
              <button class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 rounded-circle btn-remove-compare" data-id="${bike.id}" title="Remove from comparison">
                <i class="bi bi-x"></i>
              </button>
              <img src="${imgPrefix + bike.image}" alt="${bike.name}" class="img-fluid rounded-4 mb-2" style="height: 140px; object-fit: contain;">
              <h5 class="fw-bold mb-0 text-dark">${bike.name}</h5>
              <small class="text-muted">${bike.brand} ${bike.model}</small>
            </div>
          </th>
        `;

        priceCols += `<td class="text-center fw-bold fs-5 text-teal">₹${bike.pricePerDay} <span class="small text-muted fw-normal">/ day</span></td>`;
        depositCols += `<td class="text-center fw-bold text-dark">₹${bike.securityDeposit} <span class="badge bg-success-subtle text-success small ms-1">100% Refundable</span></td>`;
        catCols += `<td class="text-center">${bike.category}</td>`;
        fuelCols += `<td class="text-center"><span class="badge ${bike.fuelType === 'Electric' ? 'bg-success' : 'bg-warning text-dark'}">${bike.fuelType}</span></td>`;
        transCols += `<td class="text-center">${bike.transmission}</td>`;
        rangeCols += `<td class="text-center fw-bold">${bike.mileageOrRange}</td>`;
        seatCols += `<td class="text-center">${bike.seatingCapacity} Persons</td>`;
        ratingCols += `<td class="text-center text-warning fw-bold">★ ${bike.rating} <span class="text-muted small">(${bike.reviewCount})</span></td>`;
        locCols += `<td class="text-center text-secondary"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${bike.location}</td>`;
        actionCols += `
          <td class="text-center">
            <a href="${prefix}booking.html?id=${bike.id}" class="btn btn-pedal-accent w-100 ${!bike.isAvailable ? 'disabled' : ''}">
              <i class="bi bi-calendar-check"></i> <span data-i18n="book_now">Book Now</span>
            </a>
          </td>
        `;
      });

      const tableHtml = `
        <div class="table-responsive bg-white rounded-4 border shadow-sm p-3 mb-4">
          <table class="table table-bordered align-middle compare-matrix-table mb-0">
            <thead>
              <tr>
                <th style="width: 200px;" class="bg-light fw-bold" data-i18n="cmp_th_vehicle">Vehicle</th>
                ${headerCols}
              </tr>
            </thead>
            <tbody>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_price">Daily Rental Price</td>${priceCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_deposit">Security Deposit</td>${depositCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_category">Category</td>${catCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_fuel">Fuel Type</td>${fuelCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_trans">Transmission</td>${transCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_range">Mileage / Range</td>${rangeCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_seating">Seating Capacity</td>${seatCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_rating">Rider Rating</td>${ratingCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_location">Pickup Area</td>${locCols}</tr>
              <tr><td class="fw-bold bg-light" data-i18n="cmp_th_action">Ready to Ride?</td>${actionCols}</tr>
            </tbody>
          </table>
        </div>
        <div class="text-end">
          <a href="${prefix}bikes.html" class="btn btn-pedal-outline">
            <i class="bi bi-plus-circle"></i> <span data-i18n="nav_bikes">Add Another Bike to Compare (Max 3)</span>
          </a>
        </div>
      `;

      $container.html(tableHtml);

      if (window.PedalPalI18n) {
        PedalPalI18n.updateDOM();
      }
    }
  };
})();

window.PedalPalComparison = Comparison;
