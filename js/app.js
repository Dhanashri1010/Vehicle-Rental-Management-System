/**
 * PedalPal Master App Coordinator (js/app.js)
 * Loaded across all portals. Initializes Storage, I18n, Auth, Navigation,
 * Speech Synthesis, Notification Badge, and Global Event Delegation.
 */

$(document).ready(async function () {
  console.log('PedalPal App Coordinator initializing...');

  // 1. Initialize Storage & Translations
  await PedalPalStorage.init();
  await PedalPalI18n.init();

  // 2. Setup Top Navbar User & Demo Switcher
  setupNavbar();
  PedalPalNotifications.updateBadge();

  // 3. Setup Global Speech Reader
  setupSpeechReader();

  // 4. Setup Language Switcher
  setupLanguageSwitcher();

  // 5. Setup Wishlist & Compare Event Delegation
  setupGlobalActions();

  console.log('PedalPal App Coordinator ready.');
});

function setupNavbar() {
  const user = PedalPalAuth.getCurrentUser();
  const isPagesDir = window.location.pathname.includes('/pages/');
  const prefix = isPagesDir ? '' : 'pages/';

  if (user) {
    $('#navUserNameText').text(user.name.split(' ')[0]);
    $('#navUserRoleBadge').text(user.role.toUpperCase()).removeClass('role-customer role-owner role-admin').addClass(`role-${user.role}`);
    
    // Dynamic Portal Dashboard Link
    let dashUrl = `${prefix}customer-dashboard.html`;
    if (user.role === 'owner') dashUrl = `${prefix}owner-dashboard.html`;
    if (user.role === 'admin') dashUrl = `${prefix}admin-dashboard.html`;
    $('#navDashboardLink').attr('href', dashUrl);

    // Show/hide portal specific items
    if (user.role === 'owner') {
      $('.nav-owner-only').removeClass('d-none');
    }
    if (user.role === 'admin') {
      $('.nav-admin-only').removeClass('d-none');
    }
  }

  // Demo user switcher click
  $(document).on('click', '.switch-demo-account-btn', function (e) {
    e.preventDefault();
    const role = $(this).data('role');
    const newUser = PedalPalStorage.switchDemoUser(role);
    if (newUser) {
      PedalPalNotifications.showToast(`Switched account to: ${newUser.name} (${newUser.role.toUpperCase()})`, 'info');
      setTimeout(() => {
        if (newUser.role === 'owner') {
          window.location.href = `${prefix}owner-dashboard.html`;
        } else if (newUser.role === 'admin') {
          window.location.href = `${prefix}admin-dashboard.html`;
        } else {
          window.location.href = `${prefix}customer-dashboard.html`;
        }
      }, 500);
    }
  });

  // Logout button
  $(document).on('click', '#navLogoutBtn', function (e) {
    e.preventDefault();
    PedalPalAuth.logout();
  });

  // Notifications Bell click
  $(document).on('click', '#navNotifBellBtn', function () {
    PedalPalNotifications.renderModalList();
    const modal = new bootstrap.Modal(document.getElementById('notificationsModal'));
    modal.show();
  });

  $('#btnMarkAllNotifsRead').on('click', function () {
    const user = PedalPalStorage.getCurrentUser();
    PedalPalStorage.markAllNotificationsRead(user ? user.id : null);
    PedalPalNotifications.updateBadge();
    PedalPalNotifications.renderModalList();
  });

  // Reset Demo Data
  $(document).on('click', '#btnResetAllDemoData', async function (e) {
    e.preventDefault();
    if (confirm("Reset all PedalPal demo data back to factory seeds? This will refresh bikes, bookings and users.")) {
      await PedalPalStorage.resetDemoData();
      PedalPalNotifications.showToast("Demo database reset to factory state!", "success");
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}

function setupLanguageSwitcher() {
  $(document).on('click', '.lang-btn', async function () {
    const lang = $(this).data('lang');
    await PedalPalI18n.setLanguage(lang);
    PedalPalNotifications.showToast(`Language: ${lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : 'English'}`, 'info');
  });
}

let speechUtterance = null;
function setupSpeechReader() {
  const $btn = $('#btnListenAloud');
  if (!('speechSynthesis' in window)) {
    $btn.hide();
    return;
  }

  $btn.on('click', function () {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      $btn.removeClass('speaking').find('span').text(PedalPalI18n.t('listen'));
      $btn.find('i').removeClass('bi-stop-circle-fill').addClass('bi-volume-up-fill');
      return;
    }

    const lang = PedalPalI18n.getLanguage();
    let text = "Welcome to PedalPal. Rent verified bikes and scooters across Pune with doorstep delivery and zero deposit delay.";
    if (lang === 'hi') {
      text = "पेडलपाल में आपका स्वागत है। पुणे में अपनी मनपसंद बाइक या स्कूटर किराए पर लें। घर तक डिलीवरी और मुफ्त हेलमेट।";
    } else if (lang === 'mr') {
      text = "पेडलपाल मध्ये आपले स्वागत आहे. पुण्यात खात्रीशीर बाईक किंवा स्कूटर भाड्याने घ्या. दारात डिलिव्हरी आणि मोफत हेल्मेट.";
    }

    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.rate = 0.95;

    speechUtterance.onstart = function () {
      $btn.addClass('speaking').find('span').text(PedalPalI18n.t('stop_listen'));
      $btn.find('i').removeClass('bi-volume-up-fill').addClass('bi-stop-circle-fill');
    };

    speechUtterance.onend = function () {
      $btn.removeClass('speaking').find('span').text(PedalPalI18n.t('listen'));
      $btn.find('i').removeClass('bi-stop-circle-fill').addClass('bi-volume-up-fill');
    };

    window.speechSynthesis.speak(speechUtterance);
  });
}

function setupGlobalActions() {
  // Wishlist toggle
  $(document).on('click', '.bike-card-wishlist-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const bikeId = $(this).data('id');
    const isSaved = PedalPalStorage.toggleWishlist(bikeId);
    $(this).toggleClass('active', isSaved);
    $(this).find('i').toggleClass('bi-heart-fill', isSaved).toggleClass('bi-heart', !isSaved);
    PedalPalNotifications.showToast(isSaved ? 'Bike saved to your wishlist!' : 'Removed from wishlist.', 'info');
  });

  // Remove from wishlist on wishlist.html
  $(document).on('click', '.btn-remove-wishlist', function () {
    const bikeId = $(this).data('id');
    PedalPalStorage.toggleWishlist(bikeId);
    $(`#wishlist-item-${bikeId}`).remove();
    PedalPalNotifications.showToast('Removed from wishlist.', 'info');
  });

  // Add to Compare
  $(document).on('click', '.btn-add-compare', function (e) {
    e.preventDefault();
    const bikeId = $(this).data('id');
    const res = PedalPalStorage.addToCompare(bikeId);
    if (res.success) {
      PedalPalNotifications.showToast(`Bike added to comparison! (${res.count}/3 selected)`, 'success');
    } else {
      PedalPalNotifications.showToast(res.message, 'warning');
    }
  });

  // Remove from compare table
  $(document).on('click', '.btn-remove-compare', function () {
    const bikeId = $(this).data('id');
    PedalPalStorage.removeFromCompare(bikeId);
    PedalPalComparison.renderComparisonMatrix('#compareMatrixContainer');
    PedalPalNotifications.showToast('Removed from comparison.', 'info');
  });
}
