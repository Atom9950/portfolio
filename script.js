function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }

  // Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {

     gsap.from("#desktop-nav", {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Staggered animation for nav links
  gsap.from(".nav-links li", {
    opacity: 0,
    y: -20,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.3
  });

  // Logo animation
  gsap.from(".logo", {
    opacity: 0,
    x: -20,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.2
  });
    // Animation for profile section on page load
    gsap.from("#profile .section__pic-container img", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.out"
    });
  
    gsap.from("#profile .section__text", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
      delay: 0.3 // Slight delay after the image starts animating
    });
  
    // Staggered animation for buttons and social icons
    gsap.from("#profile .btn-container .btn", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.5
    });
  
    gsap.from("#profile #socials-container .icon", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.7
    });
  });
  

// Register ScrollTrigger plugin (if not already registered)
gsap.registerPlugin(ScrollTrigger);

// Animation for About section (previous code)
gsap.fromTo("#about .section-container",
  {
    y: 100,
    opacity: 0
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#about",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  }
);

// Animation for Experience section (previous code)
gsap.fromTo("#experience .experience-details-container",
  {
    y: 100,
    opacity: 0
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#experience",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  }
);

// Animation for Projects section
gsap.fromTo("#projects .experience-details-container",
  {
    y: 100,
    opacity: 0
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#projects",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  }
);

// Staggered animation for individual project containers
gsap.from("#projects .color-container", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2, // 0.2 second delay between each project
  scrollTrigger: {
    trigger: "#projects",
    start: "top center+=100",
    end: "top center-=100",
    toggleActions: "play none none reverse"
  }
});

// Animation for Contact section
gsap.fromTo("#contact .contact-info-upper-container",
  {
    y: 100,
    opacity: 0
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#contact",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  }
);

// Optional: Staggered animation for contact info containers
gsap.from("#contact .contact-info-container", {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15, // 0.15 second delay between each contact method
  scrollTrigger: {
    trigger: "#contact",
    start: "top center+=100",
    end: "top center-=100",
    toggleActions: "play none none reverse"
  }
});