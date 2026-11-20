/**
 * PedalPal Multistep Booking & Pricing Controller (js/booking.js)
 * Step 1: Rental Duration & Collision Validation
 * Step 2: Personal Details
 * Step 3: Pickup/Delivery Option
 * Step 4: Price Summary & Simulated Payment Confirmation
 */

const BookingFlow = (function () {
  let selectedBike = null;
  let currentStep = 1;

  // Booking state
  let bookingState = {
    pickupDate: '',
    pickupTime: '09:00',
    returnDate: '',
    returnTime: '09:00',
    durationHours: 24,
    fullName: '',
    phone: '',
    email: '',
    licence: '',
    pickupOption: 'DOORSTEP_DELIVERY',
    deliveryAddress: '',
    rentAmount: 0,
    securityDeposit: 0,
    deliveryFee: 0,
    taxes: 0,
    totalAmount: 0
  };

  function calculatePricing() {
    if (!selectedBike) return;

    const start = new Date(`${bookingState.pickupDate}T${bookingState.pickupTime}`);
    const end = new Date(`${bookingState.returnDate}T${bookingState.returnTime}`);
    const diffMs = end - start;
    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    bookingState.durationHours = hours;

    const days = Math.ceil(hours / 24);
    bookingState.rentAmount = days * selectedBike.pricePerDay;
    bookingState.securityDeposit = selectedBike.securityDeposit;
    bookingState.deliveryFee = bookingState.pickupOption === 'DOORSTEP_DELIVERY' ? 0 : 0; // Free within Pune
    bookingState.taxes = Math.round(bookingState.rentAmount * 0.12); // 12% GST simulation
    bookingState.totalAmount = bookingState.rentAmount + bookingState.securityDeposit + bookingState.deliveryFee + bookingState.taxes;

    // Update Step 4 DOM
    $('#calcDuration').text(`${days} Day(s) (${hours} hrs)`);
    $('#calcRent').text(`₹${bookingState.rentAmount}`);
    $('#calcDeposit').text(`₹${bookingState.securityDeposit}`);
    $('#calcDelivery').text(bookingState.deliveryFee === 0 ? 'FREE' : `₹${bookingState.deliveryFee}`);
    $('#calcTaxes').text(`₹${bookingState.taxes}`);
    $('#calcTotal').text(`₹${bookingState.totalAmount}`);
  }

  function validateStep(step) {
    if (step === 1) {
      const pDate = $('#bookPickupDate').val();
      const pTime = $('#bookPickupTime').val();
      const rDate = $('#bookReturnDate').val();
      const rTime = $('#bookReturnTime').val();

      if (!pDate || !rDate) {
        PedalPalNotifications.showToast('Please select both pickup and return dates.', 'warning');
        return false;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      if (pDate < todayStr) {
        PedalPalNotifications.showToast('Pickup date cannot be in the past.', 'danger');
        return false;
      }

      const start = new Date(`${pDate}T${pTime}`);
      const end = new Date(`${rDate}T${rTime}`);

      if (end <= start) {
        PedalPalNotifications.showToast('Return date & time must be after pickup date & time.', 'danger');
        return false;
      }

      // Check collision
      const collisionCheck = PedalPalStorage.checkBookingCollision(selectedBike.id, `${pDate}T${pTime}`, `${rDate}T${rTime}`);
      if (collisionCheck.hasCollision) {
        $('#collisionWarningAlert').removeClass('d-none').find('.collision-msg').text(collisionCheck.message);
        PedalPalNotifications.showToast(collisionCheck.message, 'danger');
        return false;
      } else {
        $('#collisionWarningAlert').addClass('d-none');
      }

      bookingState.pickupDate = pDate;
      bookingState.pickupTime = pTime;
      bookingState.returnDate = rDate;
      bookingState.returnTime = rTime;
      calculatePricing();
      return true;
    }

    if (step === 2) {
      const name = $('#custFullName').val().trim();
      const phone = $('#custPhone').val().trim();
      const email = $('#custEmail').val().trim();
      const licence = $('#custLicence').val().trim();

      if (!name) {
        PedalPalValidation.showError('#custFullName', 'Please enter your full legal name.');
        return false;
      } else {
        PedalPalValidation.clearError('#custFullName');
      }

      if (!PedalPalValidation.isValidIndianPhone(phone)) {
        PedalPalValidation.showError('#custPhone', 'Please enter a valid 10-digit Indian phone number.');
        return false;
      } else {
        PedalPalValidation.clearError('#custPhone');
      }

      if (!PedalPalValidation.isValidEmail(email)) {
        PedalPalValidation.showError('#custEmail', 'Please enter a valid email address.');
        return false;
      } else {
        PedalPalValidation.clearError('#custEmail');
      }

      if (!PedalPalValidation.isValidLicence(licence)) {
        PedalPalValidation.showError('#custLicence', 'Please enter your valid driving licence number.');
        return false;
      } else {
        PedalPalValidation.clearError('#custLicence');
      }

      bookingState.fullName = name;
      bookingState.phone = phone;
      bookingState.email = email;
      bookingState.licence = licence;
      return true;
    }

    if (step === 3) {
      const option = $('input[name="pickupOption"]:checked').val();
      bookingState.pickupOption = option;

      if (option === 'DOORSTEP_DELIVERY') {
        const addr = $('#deliveryAddressInput').val().trim();
        if (!addr || addr.length < 10) {
          PedalPalValidation.showError('#deliveryAddressInput', 'Please provide a complete Pune delivery address (flat/road/colony).');
          return false;
        } else {
          PedalPalValidation.clearError('#deliveryAddressInput');
        }
        bookingState.deliveryAddress = addr;
      } else {
        bookingState.deliveryAddress = `${selectedBike.location} Owner Hub, Pune`;
      }

      calculatePricing();
      return true;
    }

    return true;
  }

  function goToStep(step) {
    if (step < 1 || step > 4) return;
    currentStep = step;

    $('.checkout-step-panel').addClass('d-none');
    $(`#bookingStep${step}`).removeClass('d-none');

    // Update stepper circles
    $('.checkout-step').each(function () {
      const s = parseInt($(this).data('step'));
      if (s < step) {
        $(this).removeClass('active').addClass('completed');
      } else if (s === step) {
        $(this).addClass('active').removeClass('completed');
      } else {
        $(this).removeClass('active completed');
      }
    });

    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  return {
    initBooking(bikeId) {
      selectedBike = PedalPalStorage.getBikeById(bikeId);
      if (!selectedBike) {
        $('#bookingMainContainer').html(`
          <div class="empty-state-card my-5">
            <div class="empty-state-icon"><i class="bi bi-bicycle"></i></div>
            <h4 class="fw-bold">Please Select a Bike to Book</h4>
            <p class="text-muted">Choose any scooter or motorcycle from our Pune catalog to begin booking.</p>
            <a href="bikes.html" class="btn btn-pedal-primary"><i class="bi bi-search"></i> Explore Bikes</a>
          </div>
        `);
        return;
      }

      const imgPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
      $('#bookingBikeImg').attr('src', imgPrefix + selectedBike.image);
      $('#bookingBikeName').text(selectedBike.name);
      $('#bookingBikeCategory').text(selectedBike.category);
      $('#bookingBikeLocation').text(selectedBike.location);
      $('#bookingBikeRate').text(`₹${selectedBike.pricePerDay}/day`);

      // Prepopulate Customer fields
      const user = PedalPalStorage.getCurrentUser();
      if (user) {
        $('#custFullName').val(user.name);
        $('#custPhone').val(user.phone);
        $('#custEmail').val(user.email);
        if (user.licenceNumber) $('#custLicence').val(user.licenceNumber);
        if (user.area) $('#deliveryAddressInput').val(`Flat 101, Ideal Colony, ${user.area}, Pune`);
      }

      // Default dates (tomorrow 9 AM to day after tomorrow 9 AM)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const d1 = tomorrow.toISOString().split('T')[0];
      const d2 = dayAfter.toISOString().split('T')[0];

      $('#bookPickupDate').val(d1).attr('min', new Date().toISOString().split('T')[0]);
      $('#bookReturnDate').val(d2).attr('min', d1);

      bookingState.pickupDate = d1;
      bookingState.returnDate = d2;
      calculatePricing();

      // Event Handlers
      $('#btnNextStep1').on('click', () => { if (validateStep(1)) goToStep(2); });
      $('#btnNextStep2').on('click', () => { if (validateStep(2)) goToStep(3); });
      $('#btnNextStep3').on('click', () => { if (validateStep(3)) goToStep(4); });

      $('#btnBackStep2').on('click', () => goToStep(1));
      $('#btnBackStep3').on('click', () => goToStep(2));
      $('#btnBackStep4').on('click', () => goToStep(3));

      // Delivery toggle option
      $('input[name="pickupOption"]').on('change', function () {
        if ($(this).val() === 'DOORSTEP_DELIVERY') {
          $('#deliveryAddressGroup').removeClass('d-none');
        } else {
          $('#deliveryAddressGroup').addClass('d-none');
        }
      });

      // Recalculate on date change
      $('#bookPickupDate, #bookPickupTime, #bookReturnDate, #bookReturnTime').on('change', function () {
        validateStep(1);
      });

      // Confirm Booking (Simulated Checkout)
      $('#btnConfirmBooking').on('click', function () {
        const paymentMethod = $('input[name="paymentMethod"]:checked').val() || 'UPI (Google Pay)';
        const curUser = PedalPalStorage.getCurrentUser();

        const newBooking = {
          bikeId: selectedBike.id,
          bikeName: selectedBike.name,
          bikeCategory: selectedBike.category,
          bikeImage: selectedBike.image,
          customerId: curUser ? curUser.id : 'usr-c01',
          customerName: bookingState.fullName,
          customerPhone: bookingState.phone,
          customerEmail: bookingState.email,
          ownerId: selectedBike.ownerId,
          ownerName: "Suresh Deshmukh",
          ownerPhone: "+91 98220 12345",
          pickupDate: `${bookingState.pickupDate}T${bookingState.pickupTime}`,
          returnDate: `${bookingState.returnDate}T${bookingState.returnTime}`,
          rentalDurationHours: bookingState.durationHours,
          pickupType: bookingState.pickupOption.toLowerCase().includes('door') ? 'doorstep' : 'self-pickup',
          deliveryAddress: bookingState.deliveryAddress,
          rentAmount: bookingState.rentAmount,
          securityDeposit: bookingState.securityDeposit,
          deliveryFee: bookingState.deliveryFee,
          taxes: bookingState.taxes,
          totalAmount: bookingState.totalAmount,
          bookingStatus: 'Requested',
          paymentStatus: 'Paid',
          paymentMethod: paymentMethod
        };

        const saved = PedalPalStorage.createBooking(newBooking);

        // Show confirmation modal
        $('#confirmModalRef').text(saved.id);
        $('#confirmModalBike').text(saved.bikeName);
        $('#confirmModalAmount').text(`₹${saved.totalAmount}`);
        const modal = new bootstrap.Modal(document.getElementById('bookingConfirmationModal'));
        modal.show();
      });
    }
  };
})();

window.PedalPalBooking = BookingFlow;
