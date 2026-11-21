/**
 * PedalPal Central Data Storage Layer (js/storage.js)
 * Clean localStorage abstraction simulating backend database tables:
 * bikes, users, bookings, reviews, notifications, wishlist, compare.
 */

const Storage = (function () {
  const KEYS = {
    BIKES: 'pedalpal_bikes',
    USERS: 'pedalpal_users',
    CURRENT_USER: 'pedalpal_current_user',
    BOOKINGS: 'pedalpal_bookings',
    REVIEWS: 'pedalpal_reviews',
    NOTIFICATIONS: 'pedalpal_notifications',
    WISHLIST: 'pedalpal_wishlist',
    COMPARE: 'pedalpal_compare'
  };

  function getLocal(key, defaultVal = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn(`Error reading ${key}:`, e);
      return defaultVal;
    }
  }

  function setLocal(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error(`Error saving ${key}:`, e);
      return false;
    }
  }

  async function fetchJson(path) {
    try {
      // Adjust path for pages vs root
      const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
      const res = await fetch(prefix + path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Fetch failed for ${path} (likely file:// protocol):`, err);
      return null;
    }
  }

  return {
    async init() {
      // 1. Load BIKES
      let bikes = getLocal(KEYS.BIKES);
      if (!bikes || bikes.length === 0) {
        bikes = await fetchJson('data/bikes.json');
        if (!bikes || bikes.length === 0) {
          bikes = [];
        }
        setLocal(KEYS.BIKES, bikes);
      }

      // 2. Load USERS
      let users = getLocal(KEYS.USERS);
      if (!users || users.length === 0) {
        users = await fetchJson('data/users.json');
        if (!users || users.length === 0) {
          users = [
            { id: "usr-c01", name: "Rahul Patil", phone: "9876543210", email: "rahul.patil@gmail.com", role: "customer", city: "Pune", area: "Kothrud", licenceNumber: "MH12-2021004921", status: "active", avatar: "images/avatars/user-rahul.svg", password: "Password@123" },
            { id: "usr-o01", name: "Suresh Deshmukh", phone: "9822012345", email: "suresh.bikes@gmail.com", role: "owner", city: "Pune", area: "Kothrud", isVerified: true, badge: "Verified Owner", rating: 4.9, totalEarnings: 42500, avatar: "images/avatars/user-suresh.svg", password: "Password@123" },
            { id: "usr-admin-01", name: "Priya Deshmukh", phone: "9999900000", email: "admin@pedalpal.in", role: "admin", city: "Pune", area: "Shivajinagar", avatar: "images/avatars/admin.svg", password: "Admin@123" }
          ];
        }
        setLocal(KEYS.USERS, users);
      }

      // 3. Current User (Guests must NOT be auto-logged in)
      let currentUser = getLocal(KEYS.CURRENT_USER, null);
      if (currentUser && users && users.length > 0) {
        const userExists = users.find(u => u.id === currentUser.id);
        if (!userExists || userExists.status === 'suspended') {
          currentUser = null;
          localStorage.removeItem(KEYS.CURRENT_USER);
        }
      }

      // 4. BOOKINGS
      let bookings = getLocal(KEYS.BOOKINGS);
      if (!bookings) {
        bookings = await fetchJson('data/bookings.json') || [];
        setLocal(KEYS.BOOKINGS, bookings);
      }

      // 5. REVIEWS
      let reviews = getLocal(KEYS.REVIEWS);
      if (!reviews) {
        reviews = await fetchJson('data/reviews.json') || [];
        setLocal(KEYS.REVIEWS, reviews);
      }

      // 6. NOTIFICATIONS
      let notifications = getLocal(KEYS.NOTIFICATIONS);
      if (!notifications) {
        notifications = await fetchJson('data/notifications.json') || [];
        setLocal(KEYS.NOTIFICATIONS, notifications);
      }

      // 7. WISHLIST & COMPARE defaults
      if (!getLocal(KEYS.WISHLIST)) setLocal(KEYS.WISHLIST, ["bk-01", "bk-03"]);
      if (!getLocal(KEYS.COMPARE)) setLocal(KEYS.COMPARE, ["bk-01", "bk-07"]);

      console.log('PedalPal Storage ready. Total bikes:', bikes.length, 'Total bookings:', bookings.length);
      return true;
    },

    // BIKES API
    getBikes(filters = {}) {
      let list = getLocal(KEYS.BIKES, []);
      if (!filters) return list;

      return list.filter(bike => {
        // Only approved bikes shown to customer
        if (filters.onlyApproved && !bike.isApproved) return false;

        // Search query (keyword)
        if (filters.search && filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchName = bike.name.toLowerCase().includes(q);
          const matchBrand = bike.brand.toLowerCase().includes(q);
          const matchLoc = bike.location.toLowerCase().includes(q);
          const matchCat = bike.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchLoc && !matchCat) return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
          if (bike.category !== filters.category) return false;
        }

        // Fuel Type
        if (filters.fuel && filters.fuel !== 'all') {
          if (bike.fuelType.toLowerCase() !== filters.fuel.toLowerCase()) return false;
        }

        // Transmission
        if (filters.transmission && filters.transmission !== 'all') {
          if (bike.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
        }

        // Location / Pune Area
        if (filters.location && filters.location !== 'all' && filters.location.trim()) {
          const loc = filters.location.toLowerCase().trim();
          if (!bike.location.toLowerCase().includes(loc)) return false;
        }

        // Price Max Filter
        if (filters.maxPrice) {
          if (bike.pricePerDay > Number(filters.maxPrice)) return false;
        }

        // Availability
        if (filters.availability && filters.availability !== 'all') {
          const mustBeAvail = filters.availability === 'available';
          if (bike.isAvailable !== mustBeAvail) return false;
        }

        // Owner ID filter
        if (filters.ownerId) {
          if (bike.ownerId !== filters.ownerId) return false;
        }

        return true;
      });
    },

    getBikeById(id) {
      const list = getLocal(KEYS.BIKES, []);
      return list.find(b => b.id === id) || null;
    },

    saveBike(bikeData) {
      const list = getLocal(KEYS.BIKES, []);
      const idx = list.findIndex(b => b.id === bikeData.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...bikeData };
      } else {
        bikeData.id = bikeData.id || 'bk-' + Date.now().toString().slice(-4);
        bikeData.totalTrips = 0;
        bikeData.reviewCount = 0;
        bikeData.rating = 5.0;
        bikeData.isApproved = true;
        bikeData.isAvailable = true;
        list.unshift(bikeData);
      }
      setLocal(KEYS.BIKES, list);
      return bikeData;
    },

    deleteBike(id) {
      let list = getLocal(KEYS.BIKES, []);
      list = list.filter(b => b.id !== id);
      setLocal(KEYS.BIKES, list);
      return true;
    },

    toggleBikeAvailability(id) {
      const list = getLocal(KEYS.BIKES, []);
      const bike = list.find(b => b.id === id);
      if (bike) {
        bike.isAvailable = !bike.isAvailable;
        setLocal(KEYS.BIKES, list);
        return bike.isAvailable;
      }
      return false;
    },

    toggleBikeApproval(id) {
      const list = getLocal(KEYS.BIKES, []);
      const bike = list.find(b => b.id === id);
      if (bike) {
        bike.isApproved = !bike.isApproved;
        setLocal(KEYS.BIKES, list);
        return bike.isApproved;
      }
      return false;
    },

    // USERS & AUTH API
    getUsers() {
      return getLocal(KEYS.USERS, []);
    },

    getUserById(id) {
      const users = this.getUsers();
      return users.find(u => u.id === id) || null;
    },

    getCurrentUser() {
      return getLocal(KEYS.CURRENT_USER, null);
    },

    setCurrentUser(user) {
      if (!user) {
        localStorage.removeItem(KEYS.CURRENT_USER);
      } else {
        setLocal(KEYS.CURRENT_USER, user);
      }
      window.dispatchEvent(new CustomEvent('pedalpal_user_changed', { detail: user }));
      return user;
    },

    switchDemoUser(role) {
      const users = this.getUsers();
      const user = users.find(u => u.role === role);
      if (user) {
        return this.setCurrentUser(user);
      }
      return null;
    },

    saveUser(userData) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...userData };
      } else {
        userData.id = userData.id || 'usr-' + Date.now().toString().slice(-4);
        users.push(userData);
      }
      setLocal(KEYS.USERS, users);
      // If current user updated
      const cur = this.getCurrentUser();
      if (cur && cur.id === userData.id) {
        this.setCurrentUser(users[idx >= 0 ? idx : users.length - 1]);
      }
      return userData;
    },

    toggleUserStatus(id) {
      const users = this.getUsers();
      const user = users.find(u => u.id === id);
      if (user) {
        user.status = user.status === 'active' ? 'suspended' : 'active';
        setLocal(KEYS.USERS, users);
        return user.status;
      }
      return null;
    },

    toggleOwnerVerification(id) {
      const users = this.getUsers();
      const user = users.find(u => u.id === id && u.role === 'owner');
      if (user) {
        user.isVerified = !user.isVerified;
        user.badge = user.isVerified ? "Verified Owner" : "Pending Verification";
        setLocal(KEYS.USERS, users);
        return user.isVerified;
      }
      return null;
    },

    // BOOKINGS API
    getBookings(filter = {}) {
      let list = getLocal(KEYS.BOOKINGS, []);
      if (filter.customerId) {
        list = list.filter(b => b.customerId === filter.customerId);
      }
      if (filter.ownerId) {
        list = list.filter(b => b.ownerId === filter.ownerId);
      }
      if (filter.status && filter.status !== 'all') {
        list = list.filter(b => b.bookingStatus.toLowerCase() === filter.status.toLowerCase());
      }
      if (filter.bikeId) {
        list = list.filter(b => b.bikeId === filter.bikeId);
      }
      return list;
    },

    getBookingById(id) {
      const list = getLocal(KEYS.BOOKINGS, []);
      return list.find(b => b.id === id || b.bookingReference === id) || null;
    },

    /**
     * Temporal Collision Detection:
     * Checks if the requested booking dates overlap with an already confirmed/active booking for the same bike.
     */
    checkBookingCollision(bikeId, pickupDateStr, returnDateStr, excludeBookingId = null) {
      const bookings = this.getBookings({ bikeId });
      const newStart = new Date(pickupDateStr).getTime();
      const newEnd = new Date(returnDateStr).getTime();

      // Only active/confirmed states block the vehicle
      const blockingStatuses = ['Requested', 'Accepted', 'Confirmed', 'Ongoing'];

      for (const b of bookings) {
        if (excludeBookingId && b.id === excludeBookingId) continue;
        if (!blockingStatuses.includes(b.bookingStatus)) continue;

        const existStart = new Date(b.pickupDate).getTime();
        const existEnd = new Date(b.returnDate).getTime();

        // Overlap condition: (newStart < existEnd) and (newEnd > existStart)
        if (newStart < existEnd && newEnd > existStart) {
          return {
            hasCollision: true,
            conflictingBooking: b,
            message: `This bike is already booked from ${b.pickupDate.replace('T', ' ')} to ${b.returnDate.replace('T', ' ')}.`
          };
        }
      }

      return { hasCollision: false };
    },

    createBooking(bookingData) {
      const list = getLocal(KEYS.BOOKINGS, []);
      bookingData.id = bookingData.id || 'BK-' + Math.floor(10000 + Math.random() * 90000);
      bookingData.bookingReference = bookingData.id;
      bookingData.createdAt = new Date().toISOString();
      list.unshift(bookingData);
      setLocal(KEYS.BOOKINGS, list);

      // Create owner notification
      this.addNotification({
        userId: bookingData.ownerId,
        title: "New Booking Request",
        message: `${bookingData.customerName} has booked your ${bookingData.bikeName}. Please review and accept.`,
        type: "warning",
        icon: "bi-calendar-check"
      });

      // Create customer notification
      this.addNotification({
        userId: bookingData.customerId,
        title: "Booking Submitted",
        message: `Your booking for ${bookingData.bikeName} (${bookingData.id}) has been sent to the owner.`,
        type: "info",
        icon: "bi-send-check"
      });

      return bookingData;
    },

    updateBookingStatus(id, newStatus) {
      const list = getLocal(KEYS.BOOKINGS, []);
      const booking = list.find(b => b.id === id || b.bookingReference === id);
      if (!booking) return null;

      booking.bookingStatus = newStatus;
      booking.updatedAt = new Date().toISOString();

      if (newStatus === 'Accepted') {
        booking.paymentStatus = 'Paid';
        this.addNotification({
          userId: booking.customerId,
          title: "Booking Accepted!",
          message: `Owner ${booking.ownerName} has accepted your rental for ${booking.bikeName}. Get ready to ride!`,
          type: "success",
          icon: "bi-check-circle-fill"
        });
      } else if (newStatus === 'Rejected') {
        booking.paymentStatus = 'Refunded';
        this.addNotification({
          userId: booking.customerId,
          title: "Booking Declined",
          message: `The owner was unable to accept your booking for ${booking.bikeName}. Your safety deposit is fully refunded.`,
          type: "danger",
          icon: "bi-x-circle-fill"
        });
      } else if (newStatus === 'Cancelled') {
        booking.paymentStatus = 'Refunded';
        this.addNotification({
          userId: booking.ownerId,
          title: "Booking Cancelled",
          message: `Booking ${booking.id} was cancelled by the customer.`,
          type: "info",
          icon: "bi-info-circle"
        });
      } else if (newStatus === 'Completed') {
        this.addNotification({
          userId: booking.customerId,
          title: "Ride Completed",
          message: `Hope you enjoyed your ride on ${booking.bikeName}! ₹${booking.securityDeposit} deposit refunded.`,
          type: "success",
          icon: "bi-cash-coin"
        });
      }

      setLocal(KEYS.BOOKINGS, list);
      return booking;
    },

    // WISHLIST API
    getWishlist() {
      return getLocal(KEYS.WISHLIST, []);
    },

    toggleWishlist(bikeId) {
      let list = this.getWishlist();
      const idx = list.indexOf(bikeId);
      let isSaved = false;
      if (idx >= 0) {
        list.splice(idx, 1);
        isSaved = false;
      } else {
        list.push(bikeId);
        isSaved = true;
      }
      setLocal(KEYS.WISHLIST, list);
      return isSaved;
    },

    isInWishlist(bikeId) {
      return this.getWishlist().includes(bikeId);
    },

    // COMPARE API (Max 3 bikes)
    getCompareList() {
      return getLocal(KEYS.COMPARE, []);
    },

    addToCompare(bikeId) {
      let list = this.getCompareList();
      if (list.includes(bikeId)) return { success: true, count: list.length };
      if (list.length >= 3) {
        return { success: false, message: "You can compare up to 3 bikes at a time. Remove one first." };
      }
      list.push(bikeId);
      setLocal(KEYS.COMPARE, list);
      return { success: true, count: list.length };
    },

    removeFromCompare(bikeId) {
      let list = this.getCompareList();
      list = list.filter(id => id !== bikeId);
      setLocal(KEYS.COMPARE, list);
      return list;
    },

    // REVIEWS API
    getReviews(bikeId = null) {
      let list = getLocal(KEYS.REVIEWS, []);
      if (bikeId) {
        list = list.filter(r => r.bikeId === bikeId);
      }
      return list;
    },

    addReview(review) {
      const list = getLocal(KEYS.REVIEWS, []);
      review.id = 'rev-' + Date.now();
      review.date = new Date().toISOString().split('T')[0];
      list.unshift(review);
      setLocal(KEYS.REVIEWS, list);

      // Recalculate bike rating
      const bikeReviews = list.filter(r => r.bikeId === review.bikeId);
      const avg = bikeReviews.reduce((sum, r) => sum + r.rating, 0) / bikeReviews.length;
      const bike = this.getBikeById(review.bikeId);
      if (bike) {
        bike.rating = Number(avg.toFixed(1));
        bike.reviewCount = bikeReviews.length;
        this.saveBike(bike);
      }

      return review;
    },

    // NOTIFICATIONS API
    getNotifications(userId = null) {
      let list = getLocal(KEYS.NOTIFICATIONS, []);
      if (userId) {
        list = list.filter(n => !n.userId || n.userId === userId);
      }
      return list;
    },

    getUnreadNotifCount(userId = null) {
      const notifs = this.getNotifications(userId);
      return notifs.filter(n => !n.read).length;
    },

    markAllNotificationsRead(userId = null) {
      const list = getLocal(KEYS.NOTIFICATIONS, []);
      list.forEach(n => {
        if (!userId || n.userId === userId) {
          n.read = true;
        }
      });
      setLocal(KEYS.NOTIFICATIONS, list);
      return true;
    },

    addNotification(notif) {
      const list = getLocal(KEYS.NOTIFICATIONS, []);
      const newNotif = {
        id: 'notif-' + Date.now(),
        time: 'Just now',
        read: false,
        type: 'info',
        icon: 'bi-bell-fill',
        ...notif
      };
      list.unshift(newNotif);
      setLocal(KEYS.NOTIFICATIONS, list);
      return newNotif;
    },

    // RESET DEMO DATA
    async resetDemoData() {
      localStorage.removeItem(KEYS.BIKES);
      localStorage.removeItem(KEYS.USERS);
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.BOOKINGS);
      localStorage.removeItem(KEYS.REVIEWS);
      localStorage.removeItem(KEYS.NOTIFICATIONS);
      localStorage.removeItem(KEYS.WISHLIST);
      localStorage.removeItem(KEYS.COMPARE);
      await this.init();
      return true;
    }
  };
})();

window.PedalPalStorage = Storage;
