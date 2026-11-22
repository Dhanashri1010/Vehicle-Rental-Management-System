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
        return { success: false, field: 'email', message: "Please enter your registered email address." };
      }

      const cleanIdent = identifier.trim().toLowerCase();
      const isPhone = /^[6-9]\d{9}$/.test(cleanIdent);

      // Validate email format if not a pure 10-digit phone
      if (!isPhone) {
        if (!cleanIdent.includes('@') || !cleanIdent.includes('.')) {
          return {
            success: false,
            field: 'email',
            message: "Email address must contain '@' and '.' with a valid domain (e.g. rahul.patil@gmail.com)."
          };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanIdent)) {
          return {
            success: false,
            field: 'email',
            message: "Please enter a valid email format (e.g. name@example.com)."
          };
        }
      }

      if (!password) {
        return { success: false, field: 'password', message: "Please enter your account password." };
      }

      // Strong password validation on login
      if (password.length < 8) {
        return {
          success: false,
          field: 'password',
          message: "Password must be at least 8 characters long."
        };
      }

      const hasAlpha = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(password);

      if (!hasAlpha || !hasNumber || !hasSpecial) {
        return {
          success: false,
          field: 'password',
          message: "Password must be strong: at least 8 characters with a mix of letters (A-Z, a-z), numbers (0-9), and special characters (!@#$%^&*)."
        };
      }

      const users = PedalPalStorage.getUsers();

      // Find user by email or 10-digit mobile number
      const user = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanIdent) || 
        (u.phone && u.phone === cleanIdent)
      );

      if (!user) {
        return { success: false, field: 'email', message: "No account found with this email address. Please sign up first." };
      }

      if (user.status === 'suspended') {
        return { success: false, message: "This account has been deactivated by the administrator. Please contact support." };
      }

      // Check password strictly against the user's registered password
      if (!user.password || user.password !== password) {
        return { success: false, field: 'password', message: "Incorrect password. Please verify your credentials." };
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
      if (!email || !email.includes('@') || !email.includes('.') || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return { success: false, message: "Please enter a valid email address containing '@' and '.' (e.g. name@example.com)." };
      }
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return { success: false, message: "Please enter a valid 10-digit Indian mobile number." };
      }
      if (!userData.password || userData.password.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long." };
      }
      const hasRegAlpha = /[a-zA-Z]/.test(userData.password);
      const hasRegNumber = /[0-9]/.test(userData.password);
      const hasRegSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(userData.password);
      if (!hasRegAlpha || !hasRegNumber || !hasRegSpecial) {
        return { success: false, message: "Password must include a mix of letters, numbers (0-9), and special characters (!@#$%^&*)." };
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

    sendOtp(phone) {
      if (!phone) {
        return { success: false, message: "Please enter your 10-digit mobile number." };
      }
      const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return { success: false, message: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)." };
      }

      const users = PedalPalStorage.getUsers();
      const user = users.find(u => u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

      if (!user) {
        return { 
          success: false, 
          notFound: true, 
          phone: cleanPhone,
          message: `Mobile number ${cleanPhone} is not registered yet. Please sign up free first.` 
        };
      }

      if (user.status === 'suspended') {
        return { success: false, message: "This account has been deactivated. Please contact support." };
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      try {
        sessionStorage.setItem('pedalpal_otp_' + cleanPhone, JSON.stringify({
          otp: otp,
          timestamp: Date.now()
        }));
      } catch (e) {}

      return {
        success: true,
        otp: otp,
        phone: cleanPhone,
        userName: user.name,
        role: user.role,
        message: `OTP sent successfully to +91 ${cleanPhone}.`
      };
    },

    verifyOtp(phone, otp) {
      const cleanPhone = phone ? phone.toString().replace(/\D/g, '').slice(-10) : '';
      const cleanOtp = (otp || '').toString().trim();

      if (!cleanPhone) {
        return { success: false, message: "Please provide a mobile number." };
      }
      if (!cleanOtp || cleanOtp.length !== 6) {
        return { success: false, message: "Please enter the 6-digit OTP code." };
      }

      let sessionData = null;
      try {
        const raw = sessionStorage.getItem('pedalpal_otp_' + cleanPhone);
        if (raw) sessionData = JSON.parse(raw);
      } catch (e) {}

      // Allow master testing OTP 123456 or generated OTP
      const isValid = (sessionData && sessionData.otp === cleanOtp) || cleanOtp === '123456';

      if (!isValid) {
        return { success: false, message: "Invalid or expired OTP. Please check the code or use test code 123456." };
      }

      const users = PedalPalStorage.getUsers();
      const user = users.find(u => u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

      if (!user) {
        return { success: false, message: "Account not found for this mobile number." };
      }

      try {
        sessionStorage.removeItem('pedalpal_otp_' + cleanPhone);
      } catch (e) {}

      PedalPalStorage.setCurrentUser(user);
      return { success: true, user, message: `OTP verified successfully! Welcome back, ${user.name}.` };
    },

    requestPasswordReset(identifier) {
      if (!identifier || !identifier.trim()) {
        return { success: false, message: "Please enter your registered email address or 10-digit mobile number." };
      }

      const cleanIdent = identifier.trim().toLowerCase();
      const cleanPhone = identifier.replace(/\D/g, '').slice(-10);

      const users = PedalPalStorage.getUsers();
      const user = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanIdent) || 
        (u.phone && (u.phone === cleanIdent || u.phone.replace(/\D/g, '').slice(-10) === cleanPhone))
      );

      if (!user) {
        return { success: false, message: "No registered account found with this email or mobile number." };
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      try {
        sessionStorage.setItem('pedalpal_reset_' + user.id, JSON.stringify({
          code: resetCode,
          timestamp: Date.now()
        }));
      } catch (e) {}

      return {
        success: true,
        resetCode: resetCode,
        user: user,
        message: `Password reset code sent for ${user.name}.`
      };
    },

    resetPassword(identifier, resetCode, newPassword) {
      if (!identifier || !identifier.trim()) {
        return { success: false, message: "Please enter your email or mobile number." };
      }
      if (!resetCode || resetCode.toString().trim().length !== 6) {
        return { success: false, message: "Please enter the 6-digit verification code." };
      }
      if (!newPassword) {
        return { success: false, message: "Please enter a new password." };
      }
      if (typeof PedalPalValidation !== 'undefined' && PedalPalValidation && PedalPalValidation.isStrongPassword) {
        if (!PedalPalValidation.isStrongPassword(newPassword)) {
          const strength = PedalPalValidation.getPasswordStrength(newPassword);
          return { success: false, message: strength.message || "New password must be at least 8 characters long and contain letters, numbers, and special characters (!@#$%^&*)." };
        }
      } else {
        const hasAlpha = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(newPassword);
        if (newPassword.length < 8 || !hasAlpha || !hasNumber || !hasSpecial) {
          return { success: false, message: "New password must be at least 8 characters long and contain a mix of letters, numbers, and special characters (!@#$%^&*)." };
        }
      }

      const cleanIdent = identifier.trim().toLowerCase();
      const cleanPhone = identifier.replace(/\D/g, '').slice(-10);

      const users = PedalPalStorage.getUsers();
      const user = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanIdent) || 
        (u.phone && (u.phone === cleanIdent || u.phone.replace(/\D/g, '').slice(-10) === cleanPhone))
      );

      if (!user) {
        return { success: false, message: "Account not found." };
      }

      let resetData = null;
      try {
        const raw = sessionStorage.getItem('pedalpal_reset_' + user.id);
        if (raw) resetData = JSON.parse(raw);
      } catch (e) {}

      const isValidCode = (resetData && resetData.code === resetCode.toString().trim()) || resetCode.toString().trim() === '123456';
      if (!isValidCode) {
        return { success: false, message: "Incorrect reset code. Please check the code or use test code 123456." };
      }

      // Update password
      user.password = newPassword;
      PedalPalStorage.saveUser(user);
      try {
        sessionStorage.removeItem('pedalpal_reset_' + user.id);
      } catch (e) {}

      return {
        success: true,
        user: user,
        message: "Password reset successfully! You can now sign in with your new password."
      };
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

if (typeof window !== 'undefined') {
  window.PedalPalAuth = Auth;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}
