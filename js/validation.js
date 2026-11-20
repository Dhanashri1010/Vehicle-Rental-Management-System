/**
 * PedalPal Validation Utilities (js/validation.js)
 * Clean client-side form validation helpers with friendly error messages.
 */

const Validation = (function () {
  return {
    isValidIndianPhone(phone) {
      const clean = phone.replace(/\D/g, '');
      return /^[6-9]\d{9}$/.test(clean);
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    },

    isValidLicence(licence) {
      // Basic check for non-empty alphanumeric format
      return licence && licence.trim().length >= 8;
    },

    isValidRegistrationPlate(plate) {
      return /^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4}$/i.test(plate.trim());
    },

    showError(inputEl, message) {
      const $el = $(inputEl);
      $el.addClass('is-invalid').removeClass('is-valid');
      let $feedback = $el.siblings('.invalid-feedback');
      if (!$feedback.length) {
        $feedback = $('<div class="invalid-feedback fw-bold"></div>').insertAfter($el);
      }
      $feedback.text(message);
    },

    clearError(inputEl) {
      const $el = $(inputEl);
      $el.removeClass('is-invalid').addClass('is-valid');
      $el.siblings('.invalid-feedback').text('');
    },

    resetValidation(formEl) {
      const $form = $(formEl);
      $form.find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
      $form.find('.invalid-feedback').text('');
    }
  };
})();

window.PedalPalValidation = Validation;
