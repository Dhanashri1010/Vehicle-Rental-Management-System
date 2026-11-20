/**
 * PedalPal Notifications & Toast Controller (js/notifications.js)
 */

const Notifications = (function () {
  function getIcon(type) {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'danger': return 'bi-exclamation-triangle-fill text-danger';
      case 'warning': return 'bi-bell-fill text-warning';
      default: return 'bi-info-circle-fill text-info';
    }
  }

  return {
    updateBadge() {
      const user = PedalPalStorage.getCurrentUser();
      const count = PedalPalStorage.getUnreadNotifCount(user ? user.id : null);
      const $badge = $('.nav-notif-badge');
      if (count > 0) {
        $badge.text(count).removeClass('d-none');
      } else {
        $badge.addClass('d-none');
      }
    },

    showToast(message, type = 'info') {
      let $container = $('#toastContainer');
      if (!$container.length) {
        $container = $('<div id="toastContainer" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 2000;"></div>').appendTo('body');
      }

      const id = 'toast-' + Date.now();
      const bg = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : type === 'warning' ? 'bg-warning text-dark' : 'bg-dark text-white';

      const html = `
        <div id="${id}" class="toast align-items-center ${bg} border-0 rounded-4 shadow" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body fw-bold fs-6">
              ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;
      $container.append(html);
      const el = document.getElementById(id);
      const toast = new bootstrap.Toast(el, { delay: 3500 });
      toast.show();
      el.addEventListener('hidden.bs.toast', () => el.remove());
    },

    renderModalList() {
      const user = PedalPalStorage.getCurrentUser();
      const notifs = PedalPalStorage.getNotifications(user ? user.id : null);
      const $list = $('#notificationsListContainer');
      if (!$list.length) return;

      $list.empty();
      if (!notifs || notifs.length === 0) {
        $list.html(`
          <div class="text-center py-5">
            <i class="bi bi-bell-slash text-muted" style="font-size: 2.5rem;"></i>
            <h5 class="mt-2 text-muted fw-bold">No messages right now.</h5>
          </div>
        `);
        return;
      }

      notifs.forEach(n => {
        const itemHtml = `
          <div class="p-3 mb-2 rounded-3 border ${n.read ? 'bg-white' : 'bg-light border-warning border-2'}">
            <div class="d-flex gap-3 align-items-start">
              <i class="bi ${getIcon(n.type)} fs-4"></i>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="fw-bold mb-1">${n.title}</h6>
                  <small class="text-muted">${n.time || 'Today'}</small>
                </div>
                <p class="mb-0 text-secondary fs-6">${n.message}</p>
              </div>
            </div>
          </div>
        `;
        $list.append(itemHtml);
      });
    }
  };
})();

window.PedalPalNotifications = Notifications;
