/**
 * PedalPal Scroll Story Controller (js/scroll-story.js)
 * Implements the horizontal scroll-driven journey:
 * (1) He makes a phone call
 * (2) The owner arrives with the vehicle
 * (3) The owner hands it over and he takes it
 * (4) He rides through the city
 * (5) A big "Choose my vehicle" button
 * Respects 'prefers-reduced-motion'.
 */

(function () {
  const TOTAL_STEPS = 5;
  let trackEl, viewportEl, worldEl, characterEl, progressBarEl, stepBadgeEl, dotsContainer;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollTimeout = null;

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
      console.log('Reduced motion preferred: scroll story pinning disabled.');
      return;
    }

    // Set up click handlers for dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.story-dot');
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          scrollToStep(index + 1);
        });
      });
    }

    // Bind scroll handler with requestAnimationFrame
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Initial calculation
    onScroll();
  }

  function onScroll() {
    if (!trackEl || isReducedMotion) return;

    const trackRect = trackEl.getBoundingClientRect();
    const trackTop = trackEl.offsetTop;
    const trackHeight = trackEl.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Relative scroll inside the track
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

    // 1. Move world sideways (0vw to -400vw)
    const maxShiftVw = (TOTAL_STEPS - 1) * 100;
    const currentShift = progress * maxShiftVw;
    worldEl.style.transform = `translateX(-${currentShift}vw)`;

    // 2. Character horizontal travel & bobbing
    if (characterEl) {
      // Character walks from left 15% to 50% on screen
      const charLeftPercent = 15 + (progress * 35);
      characterEl.style.left = `${charLeftPercent}%`;

      // Character flip direction or bike transition
      characterEl.classList.add('story-walking-bob');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        characterEl.classList.remove('story-walking-bob');
      }, 150);
    }

    // 3. Current step (1 to 5)
    let currentStep = Math.min(TOTAL_STEPS, Math.floor(progress * TOTAL_STEPS) + 1);
    if (progress >= 0.98) currentStep = 5;

    // 4. Update Step Badge & Progress Bar
    if (stepBadgeEl) {
      stepBadgeEl.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
    }
    if (progressBarEl) {
      const fillPercent = Math.max(10, Math.round(progress * 100));
      progressBarEl.style.width = `${fillPercent}%`;
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
    const trackTop = trackEl.offsetTop;
    const trackHeight = trackEl.offsetHeight;
    const windowHeight = window.innerHeight;
    const stepRatio = (stepNumber - 1) / (TOTAL_STEPS - 1);
    const targetScroll = trackTop + (stepRatio * (trackHeight - windowHeight));

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  // Expose to window
  window.PedalPalStory = {
    init: initStory,
    scrollToStep: scrollToStep
  };

  // Auto init when DOM is loaded
  document.addEventListener('DOMContentLoaded', initStory);
})();

