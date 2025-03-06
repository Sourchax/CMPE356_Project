/**
 * SailMate Smooth Scrolling
 * Enhances the native scroll behavior with smooth animations
 */

// Utility function for smooth scrolling
export const smoothScrollTo = (element, duration = 500) => {
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  // Easing function for smoother animation
  const easeInOutCubic = (t) => {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  requestAnimationFrame(animation);
};

// Helper for smooth scrolling to anchor links
export const setupSmoothAnchorScrolling = () => {
  document.addEventListener('DOMContentLoaded', () => {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Skip if it's just "#" or no targetId
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          smoothScrollTo(targetElement);
        }
      });
    });
  });
};

// Helper for smooth scrolling on page load if URL has hash
export const scrollToHashOnLoad = () => {
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          smoothScrollTo(targetElement);
        }, 100);
      }
    }
  });
};

// Export a function to initialize all smooth scrolling features
export const initSmoothScrolling = () => {
  // Check if browser supports scroll-behavior
  const isScrollBehaviorSupported = 'scrollBehavior' in document.documentElement.style;
  
  // Only apply JS scrolling if browser doesn't support CSS scroll-behavior
  if (!isScrollBehaviorSupported) {
    setupSmoothAnchorScrolling();
    scrollToHashOnLoad();
  }
  
  // This part runs even if browser supports scroll-behavior
  // Add custom scroll behavior for elements with data-smooth-scroll attribute
  const scrollElements = document.querySelectorAll('[data-smooth-scroll]');
  scrollElements.forEach(el => {
    el.addEventListener('click', () => {
      const target = document.querySelector(el.dataset.target);
      if (target) smoothScrollTo(target, parseInt(el.dataset.duration) || 500);
    });
  });
}; 