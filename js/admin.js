/**
 * PedalPal Admin Portal Controller (js/admin.js)
 * Powers admin-dashboard.html, admin-customers.html, admin-owners.html,
 * admin-bikes.html, admin-bookings.html, and admin-reports.html.
 */

const Admin = (function () {
  function getStatusBadge(status) {
    const s = status.toLowerCase();
    const key = 'status_' + s;
    const text = window.PedalPalI18n ? PedalPalI18n.t(key) : status;
    return `<span class="badge-status status-${s}" data-i18n="${key}">${text}</span>`;
  }

  function getImgPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  return {
    initDashboard() {
      const users = PedalPalStorage.getUsers();
      const bikes = PedalPalStorage.getBikes();
      const bookings = PedalPalStorage.getBookings();

      const totalCustomers = users.filter(u => u.role === 'customer').length;
      const totalOwners = users.filter(u => u.role === 'owner').length;
      const totalBikes = bikes.length;
      const pendingApprovals = bikes.filter(b => !b.isApproved).length;
      const totalBookings = bookings.length;
      const grossRevenue = bookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0) + 74500;

      // Stats DOM
      $('#adminTotalCust').text(totalCustomers);
      $('#adminTotalOwners').text(totalOwners);
      $('#adminTotalBikes').text(totalBikes);
      $('#adminPendingApprovals').text(pendingApprovals);
      $('#adminTotalBookings').text(totalBookings);
      $('#adminGrossRevenue').text(`₹${grossRevenue.toLocaleString('en-IN')}`);

      // Recent Bookings Table
      const $tbody = $('#adminRecentBookingsTbody');
      $tbody.empty();
      bookings.slice(0, 6).forEach(b => {
        $tbody.append(`
          <tr>
            <td class="fw-bold">${b.bookingReference}</td>
            <td>${b.customerName}</td>
            <td>${b.bikeName}</td>
            <td class="fw-bold">₹${b.totalAmount}</td>
            <td>${getStatusBadge(b.bookingStatus)}</td>
          </tr>
        `);
      });
    },

    initCustomers() {
      function renderTable(searchTerm = '') {
        const users = PedalPalStorage.getUsers().filter(u => u.role === 'customer');
        const $tbody = $('#adminCustomersTbody');
        $tbody.empty();

        const filtered = users.filter(u => {
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
        });

        if (filtered.length === 0) {
          $tbody.html('<tr><td colspan="6" class="text-center py-4 text-muted">No customers found matching search.</td></tr>');
          return;
        }

        filtered.forEach(c => {
          $tbody.append(`
            <tr>
              <td>
                <div class="fw-bold">${c.name}</div>
                <small class="text-muted">ID: ${c.id}</small>
              </td>
              <td>${c.email}</td>
              <td>${c.phone}</td>
              <td>${c.city || 'Pune'} (${c.area || 'Kothrud'})</td>
              <td>
                <span class="badge ${c.status === 'active' ? 'bg-success' : 'bg-danger'}">${(c.status || 'active').toUpperCase()}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-secondary btn-toggle-user-status" data-id="${c.id}">
                  ${c.status === 'active' ? '<i class="bi bi-pause"></i> Suspend' : '<i class="bi bi-play"></i> Activate'}
                </button>
              </td>
            </tr>
          `);
        });
      }

      $('#adminCustSearchInput').on('input', function () {
        renderTable($(this).val().trim());
      });

      renderTable();

      $(document).on('click', '.btn-toggle-user-status', function () {
        const id = $(this).data('id');
        const newStatus = PedalPalStorage.toggleUserStatus(id);
        PedalPalNotifications.showToast(`User status set to ${newStatus}`, 'info');
        renderTable($('#adminCustSearchInput').val().trim());
      });
    },

    initOwners() {
      function renderTable(searchTerm = '') {
        const owners = PedalPalStorage.getUsers().filter(u => u.role === 'owner');
        const $tbody = $('#adminOwnersTbody');
        $tbody.empty();

        const filtered = owners.filter(o => {
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.phone.includes(q);
        });

        if (filtered.length === 0) {
          $tbody.html('<tr><td colspan="6" class="text-center py-4 text-muted">No owners found matching search.</td></tr>');
          return;
        }

        filtered.forEach(o => {
          $tbody.append(`
            <tr>
              <td>
                <div class="fw-bold">${o.name}</div>
                <small class="text-muted">ID: ${o.id}</small>
              </td>
              <td>${o.email}</td>
              <td>${o.phone}</td>
              <td>${o.city || 'Pune'} (${o.area || 'Kothrud'})</td>
              <td>
                <span class="badge ${o.isVerified ? 'bg-success' : 'bg-warning text-dark'}">${o.badge || (o.isVerified ? 'Verified Owner' : 'Pending')}</span>
              </td>
              <td>
                <button class="btn btn-sm ${o.isVerified ? 'btn-outline-warning' : 'btn-success'} btn-toggle-owner-verify" data-id="${o.id}">
                  ${o.isVerified ? '<i class="bi bi-shield-slash"></i> Revoke Badge' : '<i class="bi bi-shield-check"></i> Verify Owner'}
                </button>
              </td>
            </tr>
          `);
        });
      }

      $('#adminOwnerSearchInput').on('input', function () {
        renderTable($(this).val().trim());
      });

      renderTable();

      $(document).on('click', '.btn-toggle-owner-verify', function () {
        const id = $(this).data('id');
        const isVer = PedalPalStorage.toggleOwnerVerification(id);
        PedalPalNotifications.showToast(`Owner verification badge: ${isVer ? 'Granted' : 'Revoked'}`, 'info');
        renderTable($('#adminOwnerSearchInput').val().trim());
      });
    },

    initBikes() {
      function renderTable(category = 'all') {
        const bikes = PedalPalStorage.getBikes(category === 'all' ? {} : { category });
        const $tbody = $('#adminBikesTbody');
        const imgPrefix = getImgPrefix();
        $tbody.empty();

        bikes.forEach(b => {
          $tbody.append(`
            <tr id="admin-bike-row-${b.id}">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img src="${imgPrefix + b.image}" alt="${b.name}" width="50" height="35" class="rounded-2" style="object-fit: cover;">
                  <div>
                    <div class="fw-bold">${b.name}</div>
                    <small class="text-muted">${b.registrationNumber}</small>
                  </div>
                </div>
              </td>
              <td>${b.category}</td>
              <td><span class="badge ${b.fuelType === 'Electric' ? 'bg-success' : 'bg-warning text-dark'}">${b.fuelType}</span></td>
              <td>₹${b.pricePerDay}</td>
              <td>${b.location}</td>
              <td>
                <span class="badge ${b.isApproved ? 'bg-success' : 'bg-secondary'}">${b.isApproved ? 'Approved' : 'Pending'}</span>
              </td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-primary btn-admin-toggle-approve" data-id="${b.id}" title="Toggle approval">
                    <i class="bi ${b.isApproved ? 'bi-x-circle' : 'bi-check-circle'}"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger btn-admin-delete-bike" data-id="${b.id}" title="Remove listing">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `);
        });
      }

      $('#adminBikeCatFilter').on('change', function () {
        renderTable($(this).val());
      });

      renderTable();

      $(document).on('click', '.btn-admin-toggle-approve', function () {
        const id = $(this).data('id');
        const isApp = PedalPalStorage.toggleBikeApproval(id);
        PedalPalNotifications.showToast(`Listing approval set to ${isApp ? 'Approved' : 'Pending'}`, 'info');
        renderTable($('#adminBikeCatFilter').val());
      });

      $(document).on('click', '.btn-admin-delete-bike', function () {
        const id = $(this).data('id');
        if (confirm(`Admin action: Remove listing ${id} from database?`)) {
          PedalPalStorage.deleteBike(id);
          PedalPalNotifications.showToast('Listing removed by admin.', 'warning');
          $(`#admin-bike-row-${id}`).remove();
        }
      });
    },

    initBookings() {
      function renderTable(filterStatus = 'all', searchRef = '') {
        let bookings = PedalPalStorage.getBookings();
        if (filterStatus !== 'all') {
          bookings = bookings.filter(b => b.bookingStatus.toLowerCase() === filterStatus.toLowerCase());
        }
        if (searchRef) {
          bookings = bookings.filter(b => b.bookingReference.toLowerCase().includes(searchRef.toLowerCase()));
        }

        const $tbody = $('#adminBookingsTbody');
        $tbody.empty();

        if (bookings.length === 0) {
          $tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted">No booking records found.</td></tr>');
          return;
        }

        bookings.forEach(b => {
          $tbody.append(`
            <tr>
              <td class="fw-bold text-teal">${b.bookingReference}</td>
              <td>
                <div class="fw-bold">${b.customerName}</div>
                <small class="text-muted">${b.customerPhone}</small>
              </td>
              <td>${b.bikeName}</td>
              <td class="small text-muted">${b.pickupDate.split('T')[0]} to ${b.returnDate.split('T')[0]}</td>
              <td class="fw-bold">₹${b.totalAmount}</td>
              <td>${getStatusBadge(b.bookingStatus)}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary btn-admin-view-booking" data-id="${b.id}">
                  <i class="bi bi-eye"></i> View
                </button>
              </td>
            </tr>
          `);
        });
      }

      $('#adminBookingStatusFilter').on('change', function () {
        renderTable($(this).val(), $('#adminBookingSearchInput').val().trim());
      });

      $('#adminBookingSearchInput').on('input', function () {
        renderTable($('#adminBookingStatusFilter').val(), $(this).val().trim());
      });

      renderTable();
    },

    initReports() {
      const bikes = PedalPalStorage.getBikes();
      const bookings = PedalPalStorage.getBookings();

      // Top bikes by trips
      const sortedBikes = [...bikes].sort((a, b) => b.totalTrips - a.totalTrips).slice(0, 5);
      const $topBikesList = $('#topBikesReportList');
      $topBikesList.empty();

      sortedBikes.forEach(b => {
        $topBikesList.append(`
          <li class="list-group-item d-flex justify-content-between align-items-center py-3">
            <div>
              <h6 class="fw-bold mb-0">${b.name}</h6>
              <small class="text-muted">${b.category} • ${b.location}</small>
            </div>
            <span class="badge bg-teal rounded-pill px-3 py-2 text-white fs-6">${b.totalTrips} Trips</span>
          </li>
        `);
      });
    }
  };
})();

window.PedalPalAdmin = Admin;
