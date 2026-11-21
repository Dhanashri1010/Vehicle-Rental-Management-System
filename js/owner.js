/**
 * PedalPal Bike Owner Portal Controller (js/owner.js)
 * Powers owner-dashboard.html, owner-bikes.html, add-bike.html,
 * owner-bookings.html, and owner-earnings.html.
 */

const Owner = (function () {
  function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  function getImgPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  function getStatusBadge(status) {
    const s = status.toLowerCase();
    return `<span class="badge-status status-${s}">${status}</span>`;
  }

  return {
    initDashboard() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const ownerId = user.id;
      const myBikes = PedalPalStorage.getBikes({ ownerId });
      const myBookings = PedalPalStorage.getBookings({ ownerId });

      const totalBikes = myBikes.length;
      const activeBikes = myBikes.filter(b => b.isAvailable).length;
      const pendingRequests = myBookings.filter(b => b.bookingStatus === 'Requested').length;
      const acceptedBookings = myBookings.filter(b => ['Accepted', 'Confirmed', 'Ongoing'].includes(b.bookingStatus)).length;
      const completedBookings = myBookings.filter(b => b.bookingStatus === 'Completed');
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.rentAmount || 0), 0) + (user.totalEarnings || 42500);

      // DOM Stats
      $('#ownerTotalBikes').text(totalBikes);
      $('#ownerActiveBikes').text(activeBikes);
      $('#ownerPendingReqs').text(pendingRequests);
      $('#ownerAcceptedBookings').text(acceptedBookings);
      $('#ownerTotalEarnings').text(`₹${totalEarnings.toLocaleString('en-IN')}`);
      $('#ownerWelcomeName').text(user.name.split(' ')[0]);

      // Recent Requests Container
      const $reqsContainer = $('#ownerRecentRequestsList');
      const imgPrefix = getImgPrefix();
      $reqsContainer.empty();

      const requests = myBookings.filter(b => b.bookingStatus === 'Requested');
      if (requests.length === 0) {
        $reqsContainer.html(`
          <div class="p-4 bg-white rounded-4 border text-center">
            <i class="bi bi-check2-circle text-success fs-1 mb-2"></i>
            <h5 class="fw-bold mb-1">No Pending Requests</h5>
            <p class="text-muted small mb-0">All booking requests have been answered. You're completely up to date!</p>
          </div>
        `);
      } else {
        requests.forEach(req => {
          $reqsContainer.append(`
            <div class="pedal-card p-3 mb-3 border border-warning" id="req-card-${req.id}">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="d-flex gap-3 align-items-center">
                  <img src="${imgPrefix + req.bikeImage}" alt="${req.bikeName}" width="60" height="45" class="rounded-2" style="object-fit: cover;">
                  <div>
                    <h6 class="fw-bold mb-0">${req.bikeName}</h6>
                    <small class="text-muted">Customer: <strong>${req.customerName}</strong> (${req.customerPhone})</small>
                    <div class="small text-secondary"><i class="bi bi-clock me-1"></i>${req.pickupDate.replace('T', ' ')} &rarr; ${req.returnDate.replace('T', ' ')}</div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-5 fw-bold text-teal me-2">₹${req.totalAmount}</span>
                  <button class="btn btn-sm btn-success btn-owner-accept" data-id="${req.id}">
                    <i class="bi bi-check-lg"></i> <span data-i18n="accept_request">Accept</span>
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-owner-reject" data-id="${req.id}">
                    <i class="bi bi-x-lg"></i> <span data-i18n="reject_request">Reject</span>
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      }

      if (window.PedalPalI18n) {
        PedalPalI18n.updateDOM();
        PedalPalI18n.updateActiveButton();
      }

      // Event handlers for quick accept/reject
      $(document).on('click', '.btn-owner-accept', function () {
        const id = $(this).data('id');
        PedalPalStorage.updateBookingStatus(id, 'Accepted');
        PedalPalNotifications.showToast(`Booking ${id} accepted! Customer notified.`, 'success');
        Owner.initDashboard();
      });

      $(document).on('click', '.btn-owner-reject', function () {
        const id = $(this).data('id');
        if (confirm(`Decline rental request ${id}? Safety money will be refunded to customer.`)) {
          PedalPalStorage.updateBookingStatus(id, 'Rejected');
          PedalPalNotifications.showToast(`Booking ${id} declined.`, 'info');
          Owner.initDashboard();
        }
      });
    },

    initBikes() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const ownerId = user.id;
      const myBikes = PedalPalStorage.getBikes({ ownerId });
      const $tbody = $('#ownerBikesTbody');
      const imgPrefix = getImgPrefix();
      $tbody.empty();

      if (myBikes.length === 0) {
        $tbody.html('<tr><td colspan="7" class="text-center py-5 text-muted">You have not listed any bikes yet. Click "Add New Bike" to begin earning.</td></tr>');
        return;
      }

      myBikes.forEach(bike => {
        $tbody.append(`
          <tr id="bike-row-${bike.id}">
            <td>
              <div class="d-flex align-items-center gap-3">
                <img src="${imgPrefix + bike.image}" alt="${bike.name}" width="65" height="45" class="rounded-2" style="object-fit: cover;">
                <div>
                  <div class="fw-bold text-dark">${bike.name}</div>
                  <small class="text-muted">${bike.registrationNumber}</small>
                </div>
              </div>
            </td>
            <td><span class="badge bg-light text-dark border">${bike.category}</span></td>
            <td><span class="badge ${bike.fuelType === 'Electric' ? 'bg-success' : 'bg-warning text-dark'}">${bike.fuelType}</span></td>
            <td class="fw-bold">₹${bike.pricePerDay}</td>
            <td>★ ${bike.rating} (${bike.reviewCount})</td>
            <td>
              <label class="switch-custom">
                <input type="checkbox" class="bike-avail-toggle" data-id="${bike.id}" ${bike.isAvailable ? 'checked' : ''}>
                <span class="slider-custom"></span>
              </label>
            </td>
            <td>
              <div class="d-flex gap-2">
                <a href="add-bike.html?editId=${bike.id}" class="btn btn-sm btn-outline-primary" title="Edit bike">
                  <i class="bi bi-pencil"></i>
                </a>
                <button class="btn btn-sm btn-outline-danger btn-delete-bike" data-id="${bike.id}" title="Remove listing">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `);
      });

      // Toggle availability switch
      $(document).on('change', '.bike-avail-toggle', function () {
        const id = $(this).data('id');
        const isNowAvailable = PedalPalStorage.toggleBikeAvailability(id);
        PedalPalNotifications.showToast(`Bike status updated to: ${isNowAvailable ? 'Available' : 'Unavailable'}`, 'info');
      });

      // Delete bike action
      $(document).on('click', '.btn-delete-bike', function () {
        const id = $(this).data('id');
        if (confirm(`Are you sure you want to remove this bike listing from PedalPal?`)) {
          PedalPalStorage.deleteBike(id);
          PedalPalNotifications.showToast('Bike listing removed.', 'warning');
          $(`#bike-row-${id}`).remove();
        }
      });
    },

    initAddBike() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('editId');
      const imgPrefix = getImgPrefix();

      if (editId) {
        const bike = PedalPalStorage.getBikeById(editId);
        if (bike) {
          $('#addBikePageTitle').text('Edit Bike Listing');
          $('#addBikeSubmitBtnText').text('Save Changes');
          $('#bikeName').val(bike.name);
          $('#bikeBrand').val(bike.brand);
          $('#bikeModel').val(bike.model);
          $('#bikeRegNum').val(bike.registrationNumber);
          $('#bikeCategory').val(bike.category);
          $('#bikeFuel').val(bike.fuelType);
          $('#bikeTransmission').val(bike.transmission);
          $('#bikeYear').val(bike.manufacturingYear);
          $('#bikeMileage').val(bike.mileageOrRange);
          $('#bikeSeating').val(bike.seatingCapacity);
          $('#bikeLocation').val(bike.location);
          $('#bikePriceHour').val(bike.pricePerHour);
          $('#bikePriceDay').val(bike.pricePerDay);
          $('#bikePriceWeek').val(bike.pricePerWeek);
          $('#bikeDeposit').val(bike.securityDeposit);
          $('#bikeDesc').val(bike.description);
          $('#bikeImgPreview').attr('src', imgPrefix + bike.image).removeClass('d-none');
        }
      }

      // Live image preview
      $('#bikeImageFile').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (PNG, JPG, SVG).');
            $(this).val('');
            return;
          }
          const reader = new FileReader();
          reader.onload = function (event) {
            $('#bikeImgPreview').attr('src', event.target.result).removeClass('d-none');
          };
          reader.readAsDataURL(file);
        }
      });

      $('#addBikeForm').on('submit', function (e) {
        e.preventDefault();

        const name = $('#bikeName').val().trim();
        const brand = $('#bikeBrand').val().trim();
        const model = $('#bikeModel').val().trim();
        const reg = $('#bikeRegNum').val().trim();
        const category = $('#bikeCategory').val();
        const fuel = $('#bikeFuel').val();
        const transmission = $('#bikeTransmission').val();
        const year = parseInt($('#bikeYear').val()) || 2023;
        const mileage = $('#bikeMileage').val().trim() || '45 km/l';
        const seating = parseInt($('#bikeSeating').val()) || 2;
        const location = $('#bikeLocation').val().trim() || `${user.area || 'Kothrud'}, Pune`;
        const pHour = parseFloat($('#bikePriceHour').val()) || 40;
        const pDay = parseFloat($('#bikePriceDay').val()) || 299;
        const pWeek = parseFloat($('#bikePriceWeek').val()) || (pDay * 6);
        const deposit = parseFloat($('#bikeDeposit').val()) || 500;
        const desc = $('#bikeDesc').val().trim() || 'Clean, serviced two-wheeler ready for ride in Pune.';

        if (!name || !brand || !reg) {
          alert('Please fill in the required fields (Name, Brand, Registration Number).');
          return;
        }

        // Choose appropriate SVG image if custom file not uploaded
        let chosenImage = 'images/bikes/honda-activa-6g.svg';
        if (category === 'Motorcycles') chosenImage = 'images/bikes/re-classic-350.svg';
        else if (category === 'Electric Scooters') chosenImage = 'images/bikes/ather-450x.svg';
        else if (category === 'Electric Bikes') chosenImage = 'images/bikes/revolt-rv400.svg';

        const bikeData = {
          id: editId || 'bk-' + Date.now().toString().slice(-4),
          ownerId: user.id,
          name,
          brand,
          model,
          registrationNumber: reg,
          category,
          fuelType: fuel,
          transmission,
          manufacturingYear: year,
          mileageOrRange: mileage,
          seatingCapacity: seating,
          location,
          pincode: "411038",
          description: desc,
          features: ["Sanitized Helmet Included", "Regularly Serviced", "Full Fuel / Charge Given"],
          image: chosenImage,
          pricePerHour: pHour,
          pricePerDay: pDay,
          pricePerWeek: pWeek,
          securityDeposit: deposit,
          isAvailable: true,
          isApproved: true
        };

        PedalPalStorage.saveBike(bikeData);
        PedalPalNotifications.showToast(editId ? 'Bike listing updated!' : 'New bike listed successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'owner-bikes.html';
        }, 1200);
      });
    },

    initBookings() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const ownerId = user.id;

      function renderList(statusFilter = 'all') {
        const bookings = PedalPalStorage.getBookings({ ownerId, status: statusFilter });
        const $container = $('#ownerBookingsTableBody');
        $container.empty();

        if (bookings.length === 0) {
          $container.html('<tr><td colspan="7" class="text-center py-5 text-muted">No booking records found for this status.</td></tr>');
          return;
        }

        bookings.forEach(b => {
          const actionBtns = b.bookingStatus === 'Requested' ? `
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-success btn-owner-accept" data-id="${b.id}"><i class="bi bi-check-lg"></i> Accept</button>
              <button class="btn btn-sm btn-outline-danger btn-owner-reject" data-id="${b.id}"><i class="bi bi-x-lg"></i> Reject</button>
            </div>
          ` : `
            <span class="text-muted small">${b.bookingStatus}</span>
          `;

          $container.append(`
            <tr>
              <td class="fw-bold">${b.bookingReference}</td>
              <td>${b.bikeName}</td>
              <td>
                <div class="fw-bold">${b.customerName}</div>
                <small class="text-muted">${b.customerPhone}</small>
              </td>
              <td class="small text-muted">${b.pickupDate.replace('T', ' ')} &rarr; ${b.returnDate.replace('T', ' ')}</td>
              <td class="fw-bold text-teal">₹${b.totalAmount}</td>
              <td>${getStatusBadge(b.bookingStatus)}</td>
              <td>${actionBtns}</td>
            </tr>
          `);
        });
      }

      $('.owner-booking-tab').on('click', function () {
        $('.owner-booking-tab').removeClass('active');
        $(this).addClass('active');
        renderList($(this).data('status'));
      });

      renderList('all');

      $(document).on('click', '.btn-owner-accept', function () {
        const id = $(this).data('id');
        PedalPalStorage.updateBookingStatus(id, 'Accepted');
        PedalPalNotifications.showToast(`Booking ${id} accepted!`, 'success');
        const activeTab = $('.owner-booking-tab.active').data('status') || 'all';
        renderList(activeTab);
      });

      $(document).on('click', '.btn-owner-reject', function () {
        const id = $(this).data('id');
        if (confirm(`Reject booking ${id}? Customer will receive a full refund.`)) {
          PedalPalStorage.updateBookingStatus(id, 'Rejected');
          PedalPalNotifications.showToast(`Booking ${id} rejected.`, 'info');
          const activeTab = $('.owner-booking-tab.active').data('status') || 'all';
          renderList(activeTab);
        }
      });
    },

    initEarnings() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const ownerId = user.id;
      const myBookings = PedalPalStorage.getBookings({ ownerId });
      const completed = myBookings.filter(b => b.bookingStatus === 'Completed');

      const earnedThisMonth = 42500;
      const pendingPayout = 3450;
      const totalRides = completed.length + 14;

      $('#earnMonthVal').text(`₹${earnedThisMonth.toLocaleString('en-IN')}`);
      $('#earnPayoutVal').text(`₹${pendingPayout.toLocaleString('en-IN')}`);
      $('#earnTotalRides').text(totalRides);
    }
  };
})();

window.PedalPalOwner = Owner;

window.addEventListener('pedalpal_lang_changed', function () {
  if (window.location.pathname.includes('owner-dashboard.html')) {
    Owner.initDashboard();
  }
});
