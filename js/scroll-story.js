/**
 * PedalPal Scroll Story Controller (js/scroll-story.js)
 * Implements the horizontal scroll-driven journey:
 * (1) Easy booking from smartphone
 * (2) Verified owner arrives with vehicle at doorstep
 * (3) Owner hands over sanitized helmet and keys
 * (4) Riding freely across Pune
 * (5) Celebration & big "Choose My Vehicle" CTA button
 * 
 * Works smoothly across desktop, tablets, and mobile devices.
 * Respects 'prefers-reduced-motion'.
 */

(function () {
  const TOTAL_STEPS = 5;
  let trackEl, viewportEl, worldEl, characterEl, progressBarEl, stepBadgeEl, dotsContainer;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollTimeout = null;
  let ticking = false;
  let currentStep = 1;

  function initStory() {
    trackEl = document.getElementById('storyTrack');
    viewportEl = document.getElementById('storyViewport');
    worldEl = document.getElementById('storyWorld');
    characterEl = document.getElementById('storyCharacter');
    progressBarEl = document.getElementById('storyProgressBar');
    stepBadgeEl = document.getElementById('storyStepBadge');
    dotsContainer = document.getElementById('storyDots');

    if (!trackEl || !worldEl) return;

    if (isReducedMotion) {
      console.log('Reduced motion preferred: scroll story horizontal pinning disabled.');
      return;
    }

    // Set up click handlers for navigation dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.story-dot');
      dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          scrollToStep(index + 1);
        });
      });
    }

    // Touch swipe support for mobile users
    setupTouchNavigation();

    // Bind scroll & resize listeners with requestAnimationFrame
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    // Initial positioning
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateStoryPosition();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateStoryPosition() {
    if (!trackEl || isReducedMotion) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const trackRect = trackEl.getBoundingClientRect();
    const trackTop = trackRect.top + scrollY;
    const trackHeight = trackEl.offsetHeight;
    const windowHeight = window.innerHeight;

    // Start and end points of pinning
    const startScroll = trackTop;
    const endScroll = trackTop + trackHeight - windowHeight;

    let progress = 0;
    if (scrollY <= startScroll) {
      progress = 0;
    } else if (scrollY >= endScroll) {
      progress = 1;
    } else {
      progress = (scrollY - startScroll) / (endScroll - startScroll);
    }

    // 1. Move world sideways (0vw to -400vw across 5 panels)
    const maxShiftVw = (TOTAL_STEPS - 1) * 100;
    const currentShift = progress * maxShiftVw;
    worldEl.style.transform = `translateX(-${currentShift}vw)`;

    // 2. Character horizontal travel & walking bob
    if (characterEl) {
      // Moves smoothly from 15% to 55% of the screen width
      const charLeftPercent = 15 + (progress * 40);
      characterEl.style.left = `${charLeftPercent}%`;

      // Walking bob animation trigger
      characterEl.classList.add('story-walking-bob');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (characterEl) characterEl.classList.remove('story-walking-bob');
      }, 120);
    }

    // 3. Current active step calculation (1 to 5)
    currentStep = Math.min(TOTAL_STEPS, Math.floor(progress * TOTAL_STEPS) + 1);
    if (progress >= 0.98) currentStep = 5;

    // 4. Update Step Badge & Progress Bar Fill
    if (stepBadgeEl) {
      stepBadgeEl.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
    }
    if (progressBarEl) {
      const fillPercent = Math.max(15, Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 85 + 15));
      progressBarEl.style.width = `${fillPercent}%`;
      const wrap = progressBarEl.closest('.story-progress-bar-wrap');
      if (wrap) wrap.setAttribute('aria-valuenow', fillPercent);
    }

    // 5. Update dots active status
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.story-dot');
      dots.forEach((dot, idx) => {
        if (idx + 1 === currentStep) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'step');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });
    }
  }

  function scrollToStep(stepNumber) {
    if (!trackEl) return;
    const step = Math.max(1, Math.min(TOTAL_STEPS, stepNumber));
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const trackTop = trackEl.getBoundingClientRect().top + scrollY;
    const trackHeight = trackEl.offsetHeight;
    const windowHeight = window.innerHeight;
    const stepRatio = (step - 1) / (TOTAL_STEPS - 1);
    const targetScroll = trackTop + (stepRatio * (trackHeight - windowHeight));

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  // Touch swipe support on mobile viewports
  function setupTouchNavigation() {
    if (!viewportEl) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    viewportEl.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: true });

    viewportEl.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        // Fast horizontal swipe detected (more horizontal than vertical, swipe > 45px, under 400ms)
        if (elapsed < 400 && Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          if (deltaX < 0 && currentStep < TOTAL_STEPS) {
            // Swiped left -> Next step
            scrollToStep(currentStep + 1);
          } else if (deltaX > 0 && currentStep > 1) {
            // Swiped right -> Previous step
            scrollToStep(currentStep - 1);
          }
        }
      }
    }, { passive: true });
  }

  // Expose public API
  window.PedalPalStory = {
    init: initStory,
    scrollToStep: scrollToStep,
    getCurrentStep: () => currentStep
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStory);
  } else {
    initStory();
  }
})();
