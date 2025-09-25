// Enhanced scroll animation with reset capability
document.addEventListener("DOMContentLoaded", function () {
  // Make hero content visible immediately
  document.querySelectorAll(".hero .fade-in").forEach((el) => {
    el.classList.add("visible");
  });

  // Track which elements have been animated
  const animatedElements = new Set();

  function checkVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const triggerMargin = 100;

    document
      .querySelectorAll(
        ".fade-in, .slide-in-left, .scale-in, .progress-bar-animated"
      )
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementBottom = elementTop + rect.height;

        // Check if element is in viewport
        const isInView =
          elementTop <= scrollY + windowHeight - triggerMargin &&
          elementBottom >= scrollY + triggerMargin;

        if (isInView) {
          el.classList.add("visible");
          animatedElements.add(el);
        } else if (animatedElements.has(el)) {
          // Only remove the visible class if we've scrolled past the element
          const isAboveViewport = elementBottom < scrollY - 100;
          const isBelowViewport = elementTop > scrollY + windowHeight + 100;

          if (isAboveViewport || isBelowViewport) {
            el.classList.remove("visible");
            animatedElements.delete(el);
          }
        }
      });
  }

  // Initial check
  checkVisibility();

  // Listen for scroll events with a slight throttle
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Smooth scrolling for navigation links
  document.querySelectorAll("a.nav-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    });
  });

  // Simple form handling
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      // In a real application, you would send this data to a server
      alert(
        `Thank you for your message, ${name}! I will get back to you soon at ${email}.`
      );
      this.reset();
    });

  // Navbar background change on scroll
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = "rgba(44, 62, 80, 0.95)";
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.backgroundColor = "var(--primary-color)";
      navbar.style.boxShadow = "none";
    }
  });

  // Add loading animation for page elements
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
});

// Additional utility functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Export functions for potential future use
window.portfolioApp = {
  checkVisibility: checkVisibility,
  debounce: debounce,
};
