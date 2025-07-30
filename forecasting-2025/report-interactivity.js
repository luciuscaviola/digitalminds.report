const ANIMATION_DURATION = 800;
const THROTTLE_DELAY = 100;

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(navLinks).map((link) => document.querySelector(link.getAttribute("href")));
  const navigation = document.querySelector(".toc");
  const menuToggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".overlay");
  const mainContentWrapper = document.querySelector(".main-content-wrapper");
  const body = document.body;

  menuToggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  const throttledUpdateActiveLink = throttle(updateActiveLink, THROTTLE_DELAY);
  const throttledHandleResize = throttle(handleResize, 250);

  window.addEventListener("scroll", throttledUpdateActiveLink, { passive: true });
  window.addEventListener("resize", throttledHandleResize);

  updateActiveLink();

  /** Slider */

  const slider = document.querySelector(".hero-visual-slider");
  const slides = slider.querySelectorAll(".slide");
  const dots = slider.querySelectorAll(".dot");
  const prevButton = slider.querySelector(".arrow.prev");
  const nextButton = slider.querySelector(".arrow.next");

  let currentSliderIndex = 0;
  prevButton.addEventListener("click", () => {
    if (currentSliderIndex > 0) {
      currentSliderIndex--;
      updateSlider();
    }
  });
  nextButton.addEventListener("click", () => {
    if (currentSliderIndex < slides.length - 1) {
      currentSliderIndex++;
      updateSlider();
    }
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentSliderIndex = parseInt(dot.dataset.index);
      updateSlider();
    });
  });

  updateSlider();

  /** Utility methods */

  function toggleMenu() {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isOpen);
    navigation.classList.toggle("active");
    overlay.classList.toggle("active");
    body.classList.toggle("menu-open");
  }

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");
  }

  function handleNavClick(e) {
    e.preventDefault();
    closeMenu();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const targetPosition = mainContentWrapper.offsetTop + targetElement.offsetTop - 30;

      if (prefersReducedMotion()) {
        window.scrollTo(0, targetPosition);
        history.pushState(null, null, targetId);
      } else {
        smoothScrollTo(targetPosition, ANIMATION_DURATION, targetId);
      }
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function smoothScrollTo(targetPosition, duration, targetId) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easing = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        history.pushState(null, null, targetId);
      }
    }

    requestAnimationFrame(animation);
  }

  function updateActiveLink() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollPosition >= documentHeight - 5) {
      setActiveLink(navLinks.length - 1);
      return;
    }

    let activeIndex = -1;

    sections.forEach((section, index) => {
      if (section) {
        if (scrollPosition >= section.offsetTop - 1) {
          // Check if the section is at the top of the viewport
          activeIndex = index;
        }
      }
    });

    setActiveLink(activeIndex);
  }

  function setActiveLink(activeIndex) {
    navLinks.forEach((link, index) => {
      const isActive = index === activeIndex;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;

    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(
          () => {
            func.apply(this, args);
            lastExecTime = Date.now();
          },
          delay - (currentTime - lastExecTime)
        );
      }
    };
  }

  function handleResize() {
    closeMenu();
  }

  function updateSlider() {
    slides.forEach((slide, index) => {
      slide.style.display = index === currentSliderIndex ? "block" : "none";
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSliderIndex);
    });
    prevButton.style.display = currentSliderIndex === 0 ? "none" : "block";
    nextButton.style.display = currentSliderIndex === slides.length - 1 ? "none" : "block";
  }
});
