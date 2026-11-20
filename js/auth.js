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
      const users = PedalPalStorage.getUsers();
      const cleanIdent = identifier.trim().toLowerCase();

      // Find user by email or phone
      const user = users.find(u => 
        u.email.toLowerCase() === cleanIdent || 
        u.phone === cleanIdent
      );

      if (!user) {
        return { success: false, message: "No account found with this email or mobile number." };
      }

      if (user.status === 'suspended') {
        return { success: false, message: "Your demo account has been deactivated by the administrator." };
      }

      // Check password (in real system BCrypt, here demo password matching)
      if (user.password && user.password !== password && password !== 'Password@123' && password !== 'Admin@123') {
        return { success: false, message: "Incorrect password. (Demo password: Password@123)" };
      }

      PedalPalStorage.setCurrentUser(user);
      return { success: true, user };
    },

    register(userData) {
      const users = PedalPalStorage.getUsers();
      // Check existing email
      const existingEmail = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
      if (existingEmail) {
        return { success: false, message: "An account already exists with this email address." };
      }

      // Check existing phone
      const existingPhone = users.find(u => u.phone === userData.phone.trim());
      if (existingPhone) {
        return { success: false, message: "An account already exists with this mobile number." };
      }

      const newUser = {
        id: (userData.role === 'owner' ? 'usr-o' : 'usr-c') + Date.now().toString().slice(-4),
        name: userData.fullName.trim(),
        phone: userData.phone.trim(),
        email: userData.email.trim().toLowerCase(),
        role: userData.role || 'customer',
        city: userData.city || 'Pune',
        area: userData.area || 'Kothrud',
        licenceNumber: userData.licenceNumber || '',
        status: 'active',
        isVerified: userData.role === 'owner' ? false : true,
        avatar: userData.role === 'owner' ? 'images/avatars/user-suresh.svg' : 'images/avatars/user-rahul.svg',
        password: userData.password
      };

      PedalPalStorage.saveUser(newUser);
      PedalPalStorage.setCurrentUser(newUser);
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
      // Switch back to customer default or guest
      const customers = PedalPalStorage.getUsers().filter(u => u.role === 'customer');
      if (customers.length > 0) {
        PedalPalStorage.setCurrentUser(customers[0]);
      }
      const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
      window.location.href = prefix + 'login.html';
    },

    requireAuth(allowedRoles = []) {
      const user = this.getCurrentUser();
      const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

      if (!user) {
        window.location.href = prefix + 'login.html';
        return false;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        alert(`Access restricted. You need ${allowedRoles.join(' or ')} permission.`);
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
