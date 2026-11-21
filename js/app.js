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
  const rootPrefix = isPagesDir ? '../' : '';

  const $navLinks = $('.desktop-nav-links');
  const $userArea = $('#navAuthArea, .nav-auth-controls');

  if (!user) {
    // -------------------------------------------------------------
    // GUEST (LOGGED OUT) STATE
    // -------------------------------------------------------------
    // 1. Menu Links for Guests
    if ($navLinks.length) {
      const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
      const isBikes = window.location.pathname.endsWith('bikes.html');
      const isCompare = window.location.pathname.endsWith('compare.html');
      $navLinks.html(`
        <a href="${rootPrefix}index.html" class="nav-menu-link ${isHome ? 'active' : ''}" data-i18n="nav_home">Home</a>
        <a href="${prefix}bikes.html" class="nav-menu-link ${isBikes ? 'active' : ''}" data-i18n="nav_bikes">Explore Bikes</a>
        <a href="${prefix}compare.html" class="nav-menu-link ${isCompare ? 'active' : ''}" data-i18n="nav_compare">Compare</a>
        <a href="${rootPrefix}index.html#howItWorksSection" class="nav-menu-link" data-i18n="nav_how_it_works">How It Works</a>
        <a href="${rootPrefix}index.html#faqSection" class="nav-menu-link" data-i18n="nav_faqs">FAQs</a>
      `);
    }

    // 2. Hide Notification Bell for guests
    $('#navNotifBellBtn, #notificationsBellBtn').addClass('d-none');

    // 3. Show Login & Sign Up buttons (no role switcher, no fake user)
    if ($userArea.length) {
      $userArea.html(`
        <a href="${prefix}login.html" class="btn btn-sm btn-outline-teal fw-bold px-3 py-1 rounded-pill">
          <i class="bi bi-box-arrow-in-right me-1"></i> <span data-i18n="nav_login">Login</span>
        </a>
        <a href="${prefix}register.html" class="btn btn-sm btn-pedal-primary fw-bold px-3 py-1 rounded-pill text-white">
          <i class="bi bi-person-plus me-1"></i> <span data-i18n="nav_register">Sign Up</span>
        </a>
      `);
    }
  } else {
    // -------------------------------------------------------------
    // LOGGED IN USER STATE (Customer, Owner, or Admin)
    // -------------------------------------------------------------
    // 1. Show Notification Bell
    $('#navNotifBellBtn, #notificationsBellBtn').removeClass('d-none');

    // 2. Role-specific Menu Links
    if ($navLinks.length) {
      const path = window.location.pathname;
      if (user.role === 'customer') {
        $navLinks.html(`
          <a href="${rootPrefix}index.html" class="nav-menu-link ${path.endsWith('index.html') ? 'active' : ''}" data-i18n="nav_home">Home</a>
          <a href="${prefix}bikes.html" class="nav-menu-link ${path.endsWith('bikes.html') ? 'active' : ''}" data-i18n="nav_bikes">Explore Bikes</a>
          <a href="${prefix}compare.html" class="nav-menu-link ${path.endsWith('compare.html') ? 'active' : ''}" data-i18n="nav_compare">Compare</a>
          <a href="${prefix}wishlist.html" class="nav-menu-link ${path.endsWith('wishlist.html') ? 'active' : ''}" data-i18n="nav_wishlist">Wishlist</a>
          <a href="${prefix}my-bookings.html" class="nav-menu-link ${path.endsWith('my-bookings.html') ? 'active' : ''}" data-i18n="nav_my_bookings">My Bookings</a>
        `);
      } else if (user.role === 'owner') {
        $navLinks.html(`
          <a href="${prefix}owner-dashboard.html" class="nav-menu-link ${path.endsWith('owner-dashboard.html') ? 'active' : ''}" data-i18n="nav_dashboard">Dashboard</a>
          <a href="${prefix}owner-bikes.html" class="nav-menu-link ${path.endsWith('owner-bikes.html') ? 'active' : ''}" data-i18n="nav_my_bikes">My Bikes</a>
          <a href="${prefix}add-bike.html" class="nav-menu-link ${path.endsWith('add-bike.html') ? 'active' : ''}" data-i18n="nav_add_bike">Add Bike</a>
          <a href="${prefix}owner-bookings.html" class="nav-menu-link ${path.endsWith('owner-bookings.html') ? 'active' : ''}" data-i18n="nav_requests">Rental Requests</a>
          <a href="${prefix}owner-earnings.html" class="nav-menu-link ${path.endsWith('owner-earnings.html') ? 'active' : ''}" data-i18n="nav_earnings">Earnings</a>
        `);
      } else if (user.role === 'admin') {
        $navLinks.html(`
          <a href="${prefix}admin-dashboard.html" class="nav-menu-link ${path.endsWith('admin-dashboard.html') ? 'active' : ''}" data-i18n="nav_overview">Overview</a>
          <a href="${prefix}admin-customers.html" class="nav-menu-link ${path.endsWith('admin-customers.html') ? 'active' : ''}" data-i18n="nav_customers">Customers</a>
          <a href="${prefix}admin-owners.html" class="nav-menu-link ${path.endsWith('admin-owners.html') ? 'active' : ''}" data-i18n="nav_owners">Owners</a>
          <a href="${prefix}admin-bikes.html" class="nav-menu-link ${path.endsWith('admin-bikes.html') ? 'active' : ''}" data-i18n="nav_fleet">Fleet</a>
          <a href="${prefix}admin-bookings.html" class="nav-menu-link ${path.endsWith('admin-bookings.html') ? 'active' : ''}" data-i18n="nav_admin_portal">Bookings</a>
          <a href="${prefix}admin-reports.html" class="nav-menu-link ${path.endsWith('admin-reports.html') ? 'active' : ''}" data-i18n="nav_reports">Reports</a>
        `);
      }
    }

    // 3. Role-specific User Profile Dropdown
    if ($userArea.length) {
      const avatarSrc = rootPrefix + (user.avatar || 'images/avatars/user-rahul.svg');
      const firstName = user.name.split(' ')[0];

      let menuItems = '';
      if (user.role === 'customer') {
        menuItems = `
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}customer-dashboard.html"><i class="bi bi-speedometer2 text-teal me-2"></i><span data-i18n="nav_dashboard">Customer Dashboard</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}my-bookings.html"><i class="bi bi-card-checklist text-primary me-2"></i><span data-i18n="nav_my_bookings">My Bookings</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}wishlist.html"><i class="bi bi-heart text-danger me-2"></i><span data-i18n="nav_wishlist">Wishlist</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}profile.html"><i class="bi bi-person-gear text-secondary me-2"></i><span data-i18n="nav_profile">My Profile</span></a></li>
        `;
      } else if (user.role === 'owner') {
        menuItems = `
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}owner-dashboard.html"><i class="bi bi-speedometer2 text-primary me-2"></i><span data-i18n="nav_dashboard">Owner Dashboard</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}owner-bikes.html"><i class="bi bi-bicycle text-success me-2"></i><span data-i18n="nav_my_bikes">My Bikes</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}add-bike.html"><i class="bi bi-plus-circle text-info me-2"></i><span data-i18n="nav_add_bike">Add New Bike</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}owner-bookings.html"><i class="bi bi-inbox text-warning me-2"></i><span data-i18n="nav_requests">Rental Requests</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}owner-earnings.html"><i class="bi bi-cash-stack text-success me-2"></i><span data-i18n="nav_earnings">Earnings & Payouts</span></a></li>
        `;
      } else if (user.role === 'admin') {
        menuItems = `
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-dashboard.html"><i class="bi bi-speedometer2 text-danger me-2"></i><span data-i18n="nav_dashboard">Admin Dashboard</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-customers.html"><i class="bi bi-people me-2"></i><span data-i18n="nav_customers">Manage Customers</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-owners.html"><i class="bi bi-person-badge me-2"></i><span data-i18n="nav_owners">Manage Owners</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-bikes.html"><i class="bi bi-bicycle me-2"></i><span data-i18n="nav_fleet">Fleet Moderation</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-bookings.html"><i class="bi bi-receipt me-2"></i><span data-i18n="nav_admin_portal">Bookings Audit</span></a></li>
          <li><a class="dropdown-item rounded-3 py-2 fw-semibold" href="${prefix}admin-reports.html"><i class="bi bi-graph-up me-2"></i><span data-i18n="nav_reports">Reports & Analytics</span></a></li>
        `;
      }

      $userArea.html(`
        <div class="dropdown">
          <button class="nav-user-pill dropdown-toggle d-flex align-items-center gap-2 border bg-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${avatarSrc}" alt="${user.name}" width="28" height="28" class="rounded-circle border">
            <span class="fw-semibold text-dark">${firstName}</span>
            <span class="nav-role-badge role-${user.role}">${user.role.toUpperCase()}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg rounded-4 p-2" style="min-width: 240px;">
            <li class="px-3 py-2 border-bottom mb-1">
              <div class="fw-bold text-dark small">${user.name}</div>
              <small class="text-muted d-block text-truncate">${user.email}</small>
            </li>
            ${menuItems}
            <li><hr class="dropdown-divider"></li>
            <li>
              <button class="dropdown-item rounded-3 py-2 text-danger fw-bold" id="navLogoutBtn">
                <i class="bi bi-box-arrow-right me-2"></i> <span data-i18n="nav_logout">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      `);
    }
  }

  // Translate freshly injected navigation DOM elements
  if (window.PedalPalI18n) {
    PedalPalI18n.updateDOM();
    PedalPalI18n.updateActiveButton();
  }

  // Handle Logout button clicks
  $(document).off('click', '#navLogoutBtn').on('click', '#navLogoutBtn', function (e) {
    e.preventDefault();
    PedalPalAuth.logout();
  });
}

function setupLanguageSwitcher() {
  $(document).off('click', '.lang-btn').on('click', '.lang-btn', async function () {
    const lang = $(this).attr('data-lang') || $(this).data('lang');
    if (!lang) return;
    PedalPalI18n.setLanguage(lang);
    setupNavbar();
    PedalPalNotifications.showToast(`Language: ${lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : 'English'}`, 'info');
  });

  // Listen for language changes across all components
  window.addEventListener('pedalpal_lang_changed', function () {
    setupNavbar();
    if (window.PedalPalI18n) {
      PedalPalI18n.updateDOM();
      PedalPalI18n.updateActiveButton();
    }
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
