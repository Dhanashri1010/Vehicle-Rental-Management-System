/**
 * PedalPal Customer Portal Controller (js/customer.js)
 * Powers customer-dashboard.html, my-bookings.html, and profile.html.
 */

const Customer = (function () {
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

      const customerId = user.id;
      const bookings = PedalPalStorage.getBookings({ customerId });

      const ongoing = bookings.filter(b => b.bookingStatus === 'Ongoing').length;
      const upcoming = bookings.filter(b => ['Accepted', 'Confirmed', 'Requested'].includes(b.bookingStatus)).length;
      const completed = bookings.filter(b => b.bookingStatus === 'Completed').length;
      const total = bookings.length;

      // Stats DOM
      $('#custStatOngoing').text(ongoing);
      $('#custStatUpcoming').text(upcoming);
      $('#custStatCompleted').text(completed);
      $('#custStatTotal').text(total);

      // Welcome Banner
      $('#custWelcomeName').text(user.name.split(' ')[0]);

      // Upcoming / Active Hero Card
      const activeTrip = bookings.find(b => b.bookingStatus === 'Ongoing') || bookings.find(b => ['Confirmed', 'Accepted'].includes(b.bookingStatus));
      const $activeContainer = $('#activeTripCardContainer');
      const imgPrefix = getImgPrefix();
      const prefix = getPathPrefix();

      if (activeTrip) {
        $activeContainer.html(`
          <div class="card-pal p-4 bg-white border border-teal-subtle">
            <div class="row align-items-center">
              <div class="col-12 col-md-4 text-center">
                <img src="${imgPrefix + activeTrip.bikeImage}" alt="${activeTrip.bikeName}" class="img-fluid rounded-4 mb-2" style="max-height: 160px; object-fit: contain;">
              </div>
              <div class="col-12 col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-teal-subtle text-teal fw-bold">${activeTrip.bookingStatus.toUpperCase()} RIDE</span>
                  ${getStatusBadge(activeTrip.bookingStatus)}
                </div>
                <h4 class="fw-bold mb-1">${activeTrip.bikeName}</h4>
                <p class="text-muted small mb-2"><i class="bi bi-calendar2-check text-primary me-1"></i>${activeTrip.pickupDate.replace('T', ' ')} to ${activeTrip.returnDate.replace('T', ' ')}</p>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-light text-dark border">Ref: ${activeTrip.bookingReference}</span>
                  <span class="badge bg-light text-dark border">Owner: ${activeTrip.ownerName}</span>
                  <span class="badge bg-success-subtle text-success border">Paid: ₹${activeTrip.totalAmount}</span>
                </div>
                <div class="d-flex gap-2">
                  <a href="${prefix}my-bookings.html" class="btn btn-sm btn-pedal-primary">
                    <i class="bi bi-card-checklist"></i> View Trip Details
                  </a>
                  <a href="tel:${activeTrip.ownerPhone}" class="btn btn-sm btn-pedal-outline">
                    <i class="bi bi-telephone"></i> Call Owner
                  </a>
                </div>
              </div>
            </div>
          </div>
        `);
      } else {
        $activeContainer.html(`
          <div class="p-4 bg-white rounded-4 border text-center">
            <i class="bi bi-bicycle text-muted fs-1 mb-2"></i>
            <h5 class="fw-bold mb-1">No Active Trips</h5>
            <p class="text-muted small mb-3">You don't have any vehicle booked for today. Ready for a spin?</p>
            <a href="${prefix}bikes.html" class="btn btn-pedal-accent">
              <i class="bi bi-search"></i> Book a Bike in Pune
            </a>
          </div>
        `);
      }

      // Recent Bookings Table
      const $tbody = $('#custRecentBookingsTbody');
      $tbody.empty();
      if (bookings.length === 0) {
        $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">No booking history found.</td></tr>');
      } else {
        bookings.slice(0, 5).forEach(b => {
          $tbody.append(`
            <tr>
              <td class="fw-bold">${b.bookingReference}</td>
              <td>${b.bikeName}</td>
              <td class="small text-muted">${b.pickupDate.split('T')[0]}</td>
              <td class="fw-bold">₹${b.totalAmount}</td>
              <td>${getStatusBadge(b.bookingStatus)}</td>
            </tr>
          `);
        });
      }
    },

    initMyBookings() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      const customerId = user.id;

      function renderList(statusFilter = 'all') {
        const bookings = PedalPalStorage.getBookings({ customerId, status: statusFilter });
        const $container = $('#myBookingsList');
        const imgPrefix = getImgPrefix();
        $container.empty();

        if (bookings.length === 0) {
          $container.html(`
            <div class="empty-state-card my-4">
              <div class="empty-state-icon"><i class="bi bi-calendar-x"></i></div>
              <h5 class="fw-bold">No Bookings Found</h5>
              <p class="text-muted">You do not have any bookings matching "${statusFilter}".</p>
            </div>
          `);
          return;
        }

        bookings.forEach(b => {
          const canCancel = ['Requested', 'Accepted', 'Confirmed'].includes(b.bookingStatus);
          const cancelBtn = canCancel ? `
            <button class="btn btn-sm btn-outline-danger btn-cancel-booking" data-id="${b.id}">
              <i class="bi bi-x-circle"></i> Cancel Booking
            </button>
          ` : '';

          const html = `
            <div class="pedal-card p-4 mb-3" id="booking-card-${b.id}">
              <div class="row align-items-center">
                <div class="col-12 col-md-3 text-center mb-3 mb-md-0">
                  <img src="${imgPrefix + b.bikeImage}" alt="${b.bikeName}" class="img-fluid rounded-3" style="max-height: 120px; object-fit: contain;">
                </div>
                <div class="col-12 col-md-6 mb-3 mb-md-0">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="badge bg-dark text-white fw-bold">${b.bookingReference}</span>
                    ${getStatusBadge(b.bookingStatus)}
                  </div>
                  <h4 class="fw-bold mb-1">${b.bikeName}</h4>
                  <p class="text-muted small mb-2">
                    <i class="bi bi-clock-history me-1"></i>${b.pickupDate.replace('T', ' ')} &rarr; ${b.returnDate.replace('T', ' ')}
                  </p>
                  <p class="text-secondary small mb-0">
                    <i class="bi bi-geo-alt me-1"></i>${b.pickupType === 'doorstep' ? 'Doorstep: ' + (b.deliveryAddress || 'Pune') : 'Self Pickup at Hub'}
                  </p>
                </div>
                <div class="col-12 col-md-3 text-md-end">
                  <div class="mb-2">
                    <span class="fs-4 fw-bold text-teal">₹${b.totalAmount}</span>
                    <small class="text-muted d-block">(Deposit: ₹${b.securityDeposit})</small>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-pedal-outline btn-view-booking-detail" data-id="${b.id}">
                      <i class="bi bi-receipt"></i> View Bill
                    </button>
                    ${cancelBtn}
                  </div>
                </div>
              </div>
            </div>
          `;
          $container.append(html);
        });
      }

      // Filter tabs
      $('.booking-filter-btn').on('click', function () {
        $('.booking-filter-btn').removeClass('active');
        $(this).addClass('active');
        renderList($(this).data('status'));
      });

      // Initial render
      renderList('all');

      // Cancel booking handler
      $(document).on('click', '.btn-cancel-booking', function () {
        const id = $(this).data('id');
        if (confirm(`Are you sure you want to cancel booking ${id}? Your security deposit and rent will be 100% refunded.`)) {
          PedalPalStorage.updateBookingStatus(id, 'Cancelled');
          PedalPalNotifications.showToast(`Booking ${id} cancelled. Refund of deposit initiated.`, 'info');
          const activeFilter = $('.booking-filter-btn.active').data('status') || 'all';
          renderList(activeFilter);
        }
      });

      // View bill modal
      $(document).on('click', '.btn-view-booking-detail', function () {
        const id = $(this).data('id');
        const b = PedalPalStorage.getBookingById(id);
        if (!b) return;

        $('#billModalRef').text(b.bookingReference);
        $('#billModalBike').text(b.bikeName);
        $('#billModalDates').text(`${b.pickupDate.replace('T', ' ')} to ${b.returnDate.replace('T', ' ')} (${b.rentalDurationHours} hrs)`);
        $('#billModalPickup').text(b.deliveryAddress || 'Owner Hub, Pune');
        $('#billModalOwner').text(`${b.ownerName} (${b.ownerPhone})`);
        $('#billModalRent').text(`₹${b.rentAmount}`);
        $('#billModalDeposit').text(`₹${b.securityDeposit}`);
        $('#billModalDelivery').text(b.deliveryFee === 0 ? 'FREE' : `₹${b.deliveryFee}`);
        $('#billModalTaxes').text(`₹${b.taxes}`);
        $('#billModalTotal').text(`₹${b.totalAmount}`);
        $('#billModalPayment').text(`${b.paymentMethod} • Status: ${b.paymentStatus}`);
        $('#billModalStatus').html(getStatusBadge(b.bookingStatus));

        const modal = new bootstrap.Modal(document.getElementById('bookingBillModal'));
        modal.show();
      });
    },

    initProfile() {
      const user = PedalPalStorage.getCurrentUser();
      if (!user) return;

      $('#profFullName').val(user.name);
      $('#profEmail').val(user.email);
      $('#profPhone').val(user.phone);
      $('#profCity').val(user.city || 'Pune');
      $('#profArea').val(user.area || 'Kothrud');
      $('#profLicence').val(user.licenceNumber || '');
      $('#profAvatar').attr('src', getImgPrefix() + (user.avatar || 'images/avatars/user-rahul.svg'));
      $('#profRoleBadge').text(user.role.toUpperCase());

      $('#profileForm').on('submit', function (e) {
        e.preventDefault();
        const updated = {
          ...user,
          name: $('#profFullName').val().trim(),
          phone: $('#profPhone').val().trim(),
          city: $('#profCity').val().trim(),
          area: $('#profArea').val().trim(),
          licenceNumber: $('#profLicence').val().trim()
        };

        PedalPalStorage.saveUser(updated);
        PedalPalNotifications.showToast('Profile information updated successfully!', 'success');
      });
    }
  };
})();

window.PedalPalCustomer = Customer;
