const ANIMATION_DURATION = 800;
const THROTTLE_DELAY = 100;

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-690N9JZYZC");

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const mainFindingsLinks = document.querySelectorAll(".main-findings a");
  const sectionIds = Array.from(navLinks).map((link) => link.getAttribute("href"));
  const navigation = document.querySelector(".toc");
  const menuToggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".overlay");
  const body = document.body;

  menuToggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });
  mainFindingsLinks.forEach((link) => {
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

  /** Back to Top Button */
  const backToTopButton = document.createElement("a");
  backToTopButton.href = sectionIds[0];
  backToTopButton.classList.add("back-to-top-button");
  backToTopButton.innerHTML = "↑";
  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", () => {
    if (window.scrollY > getOffsetTopRelativeToBody(document.querySelector(sectionIds[0])))
      backToTopButton.classList.add("visible");
    else backToTopButton.classList.remove("visible");
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToId(sectionIds[0]);
  });

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
    scrollToId(this.getAttribute("href"));
  }

  function scrollToId(targetId) {
    const targetElement = document.querySelector(targetId);
    const targetPosition = getOffsetTopRelativeToBody(targetElement) - 30;

    if (prefersReducedMotion()) {
      window.scrollTo(0, targetPosition);
      history.pushState(null, null, targetId);
    } else {
      smoothScrollTo(targetPosition, ANIMATION_DURATION, targetId);
    }
  }

  /**
   * Calculates the cumulative top offset of an element relative to the document body.
   * @param {HTMLElement} element - The DOM element to get the offset for.
   * @returns {number} The top offset in pixels (or 0 if element is invalid).
   */
  function getOffsetTopRelativeToBody(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid element provided.");
      return 0;
    }

    let top = 0;
    let currentElement = element;

    while (currentElement) {
      top += currentElement.offsetTop;
      currentElement = currentElement.offsetParent;
    }

    return top;
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

    sectionIds.forEach((sectionId, index) => {
      if (scrollPosition >= getOffsetTopRelativeToBody(document.querySelector(sectionId)) - 60) {
        // Check if the section is at the top of the viewport
        activeIndex = index;
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


// Move footnote references to the end of sentences within main-findings summary boxes
document.addEventListener('DOMContentLoaded', function() {
  const mainFindingsItems = document.querySelectorAll('.main-findings li');
  
  mainFindingsItems.forEach(item => {
    const anchor = item.querySelector('a');
    const footnoteRef = item.querySelector('.footnote-ref');
    const brTag = item.querySelector('br');
    
    if (anchor && footnoteRef) {
      // Remove the footnote from its current position
      const footnoteClone = footnoteRef.cloneNode(true);
      footnoteRef.remove();
      
      // Remove any <br> tags that might be left hanging
      if (brTag) brTag.remove();
      
      // Add the footnote to the end of the anchor text (before closing </a>)
      anchor.appendChild(footnoteClone);
    }
  });
});
