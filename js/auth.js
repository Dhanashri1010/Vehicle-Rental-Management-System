/**
 * PedalPal Authentication & Session Controller (js/auth.js)
 * Manages demo authentication, login, registration, role verification,
 * and session state across portals.
 */

const Auth = (function () {
  return {
    getCurrentUser() {
      return PedalPalStorage.getCurrentUser();
    },

    isLoggedIn() {
      return !!this.getCurrentUser();
    },

    getUserRole() {
      const user = this.getCurrentUser();
      return user ? user.role : 'guest';
    },

    login(identifier, password) {
      if (!identifier || !identifier.trim()) {
        return { success: false, message: "Please enter your registered email address or mobile number." };
      }
      if (!password) {
        return { success: false, message: "Please enter your account password." };
      }

      const users = PedalPalStorage.getUsers();
      const cleanIdent = identifier.trim().toLowerCase();

      // Find user by email or 10-digit mobile number
      const user = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanIdent) || 
        (u.phone && u.phone === cleanIdent)
      );

      if (!user) {
        return { success: false, message: "No account found with this email or mobile number." };
      }

      if (user.status === 'suspended') {
        return { success: false, message: "This account has been deactivated by the administrator. Please contact support." };
      }

      // Check password strictly against the user's registered password
      if (!user.password || user.password !== password) {
        return { success: false, message: "Incorrect password. Please verify your credentials." };
      }

      PedalPalStorage.setCurrentUser(user);
      return { success: true, user };
    },

    register(userData) {
      const users = PedalPalStorage.getUsers();
      const email = (userData.email || '').trim().toLowerCase();
      const phone = (userData.phone || '').trim();

      // Validate required fields
      if (!userData.fullName || !userData.fullName.trim()) {
        return { success: false, message: "Please enter your full legal name." };
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: "Please enter a valid email address." };
      }
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return { success: false, message: "Please enter a valid 10-digit Indian mobile number." };
      }
      if (!userData.password || userData.password.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long." };
      }

      // Check existing email
      const existingEmail = users.find(u => u.email && u.email.toLowerCase() === email);
      if (existingEmail) {
        return { success: false, message: "An account already exists with this email address. Please sign in instead." };
      }

      // Check existing phone
      const existingPhone = users.find(u => u.phone && u.phone === phone);
      if (existingPhone) {
        return { success: false, message: "An account already exists with this mobile number. Please sign in instead." };
      }

      // Security rule: public registration only allows 'customer' or 'owner'. NEVER 'admin'.
      const assignedRole = userData.role === 'owner' ? 'owner' : 'customer';

      const newUser = {
        id: (assignedRole === 'owner' ? 'usr-o' : 'usr-c') + Date.now().toString().slice(-4),
        name: userData.fullName.trim(),
        phone: phone,
        email: email,
        role: assignedRole,
        address: (userData.address || '').trim(),
        area: (userData.area || 'Kothrud').trim(),
        city: (userData.city || 'Pune').trim(),
        pincode: (userData.pincode || '411038').trim(),
        licenceNumber: (userData.licenceNumber || '').trim(),
        status: 'active',
        isVerified: assignedRole === 'owner' ? false : true,
        badge: assignedRole === 'owner' ? 'Pending Verification' : undefined,
        avatar: assignedRole === 'owner' ? 'images/avatars/user-suresh.svg' : 'images/avatars/user-rahul.svg',
        password: userData.password,
        createdAt: new Date().toISOString()
      };

      PedalPalStorage.saveUser(newUser);
      // NOTE: Do NOT automatically log user in. They must explicitly sign in with their credentials.
      return { success: true, user: newUser };
    },

    quickLogin(role) {
      const user = PedalPalStorage.switchDemoUser(role);
      if (user) {
        return { success: true, user };
      }
      return { success: false, message: "Could not find demo account for " + role };
    },

    logout() {
      // Clear user session completely - do NOT switch to another user!
      PedalPalStorage.setCurrentUser(null);
      const isPages = window.location.pathname.includes('/pages/');
      const homeUrl = isPages ? '../index.html' : 'index.html';
      window.location.href = homeUrl;
    },

    requireAuth(allowedRoles = []) {
      const user = this.getCurrentUser();
      const isPages = window.location.pathname.includes('/pages/');
      const prefix = isPages ? '' : 'pages/';

      if (!user) {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const redirectParam = encodeURIComponent(currentFile + window.location.search);
        window.location.href = `${prefix}login.html?redirect=${redirectParam}`;
        return false;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        alert(`Access Restricted: This section requires ${allowedRoles.join(' or ')} permission.`);
        if (user.role === 'owner') {
          window.location.href = prefix + 'owner-dashboard.html';
        } else if (user.role === 'admin') {
          window.location.href = prefix + 'admin-dashboard.html';
        } else {
          window.location.href = prefix + 'customer-dashboard.html';
        }
        return false;
      }

      return true;
    }
  };
})();

window.PedalPalAuth = Auth;
