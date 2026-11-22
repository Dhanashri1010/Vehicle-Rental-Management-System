/**
 * PedalPal Validation Utilities (js/validation.js)
 * Clean client-side form validation helpers with friendly error messages.
 */

const Validation = (function () {
  return {
    isValidIndianPhone(phone) {
      if (!phone) return false;
      const clean = phone.toString().replace(/\D/g, '');
      return /^[6-9]\d{9}$/.test(clean);
    },

    /**
     * Checks if email contains '@' and '.' and matches valid standard email format.
     */
    isValidEmail(email) {
      if (!email || typeof email !== 'string') return false;
      const trimmed = email.trim();
      // Must contain '@' and '.'
      if (!trimmed.includes('@') || !trimmed.includes('.')) return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    },

    /**
     * Checks if password is strong:
     * - Minimum 8 characters long
     * - Contains alphabet letter (a-z, A-Z)
     * - Contains number (0-9)
     * - Contains special character (!@#$%^&* etc.)
     */
    isStrongPassword(password) {
      if (!password || typeof password !== 'string') return false;
      if (password.length < 8) return false;
      const hasAlpha = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(password);
      return hasAlpha && hasNumber && hasSpecial;
    },

    /**
     * Returns detailed criteria breakdown for real-time visual feedback
     */
    getPasswordStrength(password) {
      const pwd = password || '';
      const hasLength = pwd.length >= 8;
      const hasAlpha = /[a-zA-Z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(pwd);
      const isStrong = hasLength && hasAlpha && hasNumber && hasSpecial;

      let score = 0;
      if (hasLength) score += 25;
      if (hasAlpha) score += 25;
      if (hasNumber) score += 25;
      if (hasSpecial) score += 25;

      let message = '';
      if (!hasLength) {
        message = 'Password must be at least 8 characters long.';
      } else if (!hasAlpha) {
        message = 'Password must include at least one letter (a-z, A-Z).';
      } else if (!hasNumber) {
        message = 'Password must include at least one number (0-9).';
      } else if (!hasSpecial) {
        message = 'Password must include at least one special character (!@#$%^&*).';
      } else {
        message = 'Strong password!';
      }

      return {
        isStrong,
        hasLength,
        hasAlpha,
        hasNumber,
        hasSpecial,
        score,
        message
      };
    },

    isValidLicence(licence) {
      // Basic check for non-empty alphanumeric format
      return licence && licence.trim().length >= 8;
    },

    isValidRegistrationPlate(plate) {
      return /^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4}$/i.test((plate || '').trim());
    },

    showError(inputEl, message) {
      const $el = $(inputEl);
      $el.addClass('is-invalid').removeClass('is-valid');
      let $feedback = $el.siblings('.invalid-feedback');
      if (!$feedback.length) {
        $feedback = $el.parent().find('.invalid-feedback');
      }
      if (!$feedback.length) {
        $feedback = $('<div class="invalid-feedback fw-bold"></div>').insertAfter($el);
      }
      $feedback.text(message).show();
    },

    clearError(inputEl) {
      const $el = $(inputEl);
      $el.removeClass('is-invalid').addClass('is-valid');
      let $feedback = $el.siblings('.invalid-feedback');
      if (!$feedback.length) {
        $feedback = $el.parent().find('.invalid-feedback');
      }
      $feedback.text('').hide();
    },

    resetValidation(formEl) {
      const $form = $(formEl);
      $form.find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
      $form.find('.invalid-feedback').text('').hide();
    }
  };
})();

if (typeof window !== 'undefined') {
  window.PedalPalValidation = Validation;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validation;
}
