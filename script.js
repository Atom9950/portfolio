import { GEMINI_API_KEY } from './config.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// HERO SLIDER ANIMATION (Scroll direction based)
const firstText = document.getElementById('firstText');
const secondText = document.getElementById('secondText');
const slider = document.getElementById('heroSlider');

// Ensure both texts match for seamless looping
if (firstText && secondText) {
  secondText.textContent = firstText.textContent;
}

let xPercent = 0;
let direction = -1;

gsap.registerPlugin(ScrollTrigger);

// Set initial position of second text
if (secondText) {
  gsap.set(secondText, {
    left: secondText.getBoundingClientRect().width
  });
}

// ScrollTrigger setup
if (slider) {
  gsap.to(slider, {
    scrollTrigger: {
      trigger: document.documentElement,
      scrub: 0.5,
      start: 0,
      end: window.innerHeight,
      onUpdate: e => direction = e.direction * -1
    },
    x: "-500px",
  });
}

// Animation function
const animateHeroSlider = () => {
  // Reset position when it goes too far
  if (xPercent < -100) {
    xPercent = 0;
  } else if (xPercent > 0) {
    xPercent = -100;
  }

  // Apply transform to both text elements
  if (firstText && secondText) {
    gsap.set(firstText, { xPercent: xPercent });
    gsap.set(secondText, { xPercent: xPercent });
  }

  // Continue animation
  requestAnimationFrame(animateHeroSlider);
  // Update xPercent based on direction
  xPercent += 0.1 * direction;
};

requestAnimationFrame(animateHeroSlider);

window.addEventListener('resize', () => {
  if (secondText) {
    gsap.set(secondText, {
      left: secondText.getBoundingClientRect().width
    });
  }
});

function initAnimations() {
  // Chatbot Section Animation - Fixed version
  gsap.from("#ai-chat .chat-container", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#ai-chat",
      start: "top 75%",
      end: "top 25%",
      toggleActions: "play none none none",
      markers: false // Set to true for debugging
    }
  });

  // Staggered animation for chat elements
  gsap.from("#ai-chat .chat-messages, #ai-chat .chat-input", {
    y: 40,
    opacity: 0,
    duration: 0.5,
    stagger: 0.15,
    delay: 0.1,
    scrollTrigger: {
      trigger: "#ai-chat .chat-container",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // About Section
  gsap.fromTo("#about .section-container", 
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 75%",
        end: "top 25%",
        toggleActions: "play none none none"
      }
    }
  );

  // Experience Section
  gsap.from("#experience .experience-details-container", {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: "#experience",
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });

// Work Experience Timeline Animation - Responsive Version
const workExperienceAnimation = () => {
  const mm = gsap.matchMedia();
  
  mm.add({
    // Desktop
    desktop: "(min-width: 768px)",
    mobile: "(max-width: 767px)"
  }, (context) => {
    const { desktop, mobile } = context.conditions;
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#work-experience",
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
    
    // Common animations for all devices
    timeline.from("#work-experience .timeline-container", {
      y: mobile ? 30 : 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    timeline.from("#work-experience .timeline-dot", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: mobile ? 0.1 : 0.3
    }, "<");
    
    timeline.from("#work-experience .timeline-content", {
      x: mobile ? 40 : 100,
      opacity: 0,
      duration: 0.8,
      delay: mobile ? 0.2 : 0.5,
      ease: "power2.out"
    });
    
    timeline.from("#work-experience .company-logo, #work-experience .experience-header, #work-experience .experience-details li", {
      y: mobile ? 10 : 20,
      opacity: 0,
      duration: 0.4,
      stagger: mobile ? 0.05 : 0.1,
      delay: mobile ? 0.3 : 0.8,
      ease: "power2.out"
    });
  });
};

// Initialize the animation
workExperienceAnimation();

  // Projects Section
  const projectContainers = gsap.utils.toArray("#projects .color-container");
  projectContainers.forEach((container, i) => {
    gsap.from(container, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.15,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });

  // Interests Section
  gsap.from("#interests .details-container", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#interests",
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });

  // Contact Section
  gsap.from("#contact .contact-info-container", {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    scrollTrigger: {
      trigger: "#contact",
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });
}
// Chat functionality with Gemini API integration



// Location Badge Interactive Effect
function initLocationBadge() {
  const locationBadge = document.querySelector('.location-badge');
  const globeIcon = document.querySelector('.globe-icon');
  
  if (locationBadge && globeIcon) {
    locationBadge.addEventListener('mouseenter', () => {
      globeIcon.style.animationDuration = '2s';
    });
    
    locationBadge.addEventListener('mouseleave', () => {
      globeIcon.style.animationDuration = '8s';
    });
  }
}

// Chat functionality with Gemini API integration
document.addEventListener('DOMContentLoaded', () => {
  initAnimations(); // Ensure all GSAP section animations are initialized
  initLocationBadge(); // Initialize location badge interactions
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    try {
      // Add user message
      addMessage(message, 'user');
      userInput.value = '';
      userInput.disabled = true;
      sendButton.disabled = true;

      // Add loading message
      const loadingMessage = addMessage('Thinking...', 'ai', true);

      // Get context and generate response
      const response = await generateResponse(message);

      // Remove loading message and add actual response
      removeLoading(loadingMessage);
      addMessage(response, 'ai');

    } catch (error) {
      removeLoading();
      addMessage('Error: Please try again later', 'ai');
      console.error('Chat Error:', error);
    } finally {
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.focus();
    }
  }

  async function generateResponse(userMessage) {
    // Load context from file
    const contextResponse = await fetch('./me.txt');
    if (!contextResponse.ok) throw new Error("Failed to load context");
    const context = await contextResponse.text();

    // Create full prompt
    const fullPrompt = `${context}\n\nUser: ${userMessage}\nSayan:`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
  }

  function addMessage(content, sender, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message${isLoading ? ' loading' : ''}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (isLoading) {
      contentDiv.innerHTML = `
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `;
    } else {
      // Use DOMPurify to sanitize the content
      contentDiv.innerHTML = window.DOMPurify.sanitize(
        content
          .split("\n")
          .map(line =>
            line
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold (**text**)
              .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic (*text*)
          )
          .join("<br>")
      );
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
  }

  function removeLoading(loadingMessage) {
    loadingMessage?.remove();
  }

  // Event listeners
  sendButton.addEventListener('click', handleUserInput);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
  });
});

// Helper functions
function downloadResume() {
  const link = document.createElement('a');
  link.href = '/assets/cv.pdf';
  link.download = 'Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Animated Navigation Menu Implementation
class AnimatedNavigation {
  constructor() {
    this.isActive = false;
    this.burgerButton = document.getElementById('burger-button');
    this.burger = document.getElementById('burger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setActiveNavLink();
  }

  setupEventListeners() {
    // Burger button click
    this.burgerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Navigation link clicks
    this.navLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        this.handleNavLinkClick(e, link, index);
      });

      // Hover effects
      link.addEventListener('mouseenter', () => {
        this.setActiveIndicator(link);
      });
    });

    // Reset indicator on mouse leave
    this.navMenu.addEventListener('mouseleave', () => {
      this.setActiveNavLink();
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) && !this.burgerButton.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Removed resize handler for SVG curve
  }

  // Removed SVG curve setup

  toggleMenu() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.isActive = true;
    this.burger.classList.add('active');
    this.navMenu.classList.add('active');
    
    // Set active nav link after animation starts
    setTimeout(() => {
      this.setActiveNavLink();
    }, 200);
  }

  closeMenu() {
    this.isActive = false;
    this.burger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }

  // Removed complex SVG animation functions

  setActiveIndicator(activeLink) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current link
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  setActiveNavLink() {
    // Get current page section or default to home
    const currentHash = window.location.hash || '#';
    let activeLink = null;
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentHash || (href === '#' && currentHash === '')) {
        activeLink = link;
      }
    });
    
    this.setActiveIndicator(activeLink || this.navLinks[0]);
  }

  handleNavLinkClick(e, link, index) {
    // Don't prevent default to allow normal navigation
    this.setActiveIndicator(link);
    
    // Close menu immediately for snappier feel
    setTimeout(() => {
      this.closeMenu();
    }, 150);
  }
}

// Initialize the animated navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  new AnimatedNavigation();
});

// Remove old hamburger scroll functionality as it's no longer needed

document.querySelectorAll('.icon-container').forEach(container => {
  const img = container.querySelector('.tech-icon');
  const tooltip = container.querySelector('.tooltip');
  tooltip.textContent = img.alt;
});

// Dark mode functionality

// --- Smooth Dark Mode Transition Overlay Implementation ---
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  let overlay = document.querySelector('.transition-overlay');

  // Create overlay if not present
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#121212';
    overlay.style.zIndex = '10000';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    document.body.appendChild(overlay);
  }

  // Check for saved preference
  const isDarkMode = localStorage.getItem('dark-mode') === 'enabled';
  if (isDarkMode) {
    body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        overlay.style.opacity = '1';
        setTimeout(() => {
          body.classList.add('dark-mode');
          localStorage.setItem('dark-mode', 'enabled');
          setTimeout(() => {
            overlay.style.opacity = '0';
          }, 400);
        }, 100);
      } else {
        overlay.style.opacity = '1';
        setTimeout(() => {
          body.classList.remove('dark-mode');
          localStorage.setItem('dark-mode', 'disabled');
          setTimeout(() => {
            overlay.style.opacity = '0';
          }, 400);
        }, 100);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  const changingText = document.getElementById('changing-text');
  const svgPath = document.querySelector('.preloader-svg path');
  
  const words = ["Hello", "Hola", "Bonjour","olá","こんにちは","合禮", "नमस्ते", "ہیلو", "নমস্কার" ];
  let index = 0;
  
  // Set dimensions
  const setDimension = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      document.querySelector('.preloader-svg').setAttribute('viewBox', `0 0 ${width} ${height + 300}`);
      return { width, height };
  };
  
  // Set initial SVG path with circular curve
  const setSvgPath = () => {
      const { width, height } = setDimension();
      const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height + 300} 0 ${height} L0 0`;
      svgPath.setAttribute('d', initialPath);
  };
  
  // Animate text appearance
  const animateText = () => {
      gsap.to('.preloader-text', {
          opacity: 0.75,
          duration: 1,
          delay: 0.2,
          ease: "power2.out"
      });
  };
  
  // Cycle through words
  const cycleWords = () => {
      if (index < words.length - 1) {
          setTimeout(() => {
              index++;
              changingText.textContent = words[index];
              cycleWords();
          }, index === 0 ? 1000 : 150);
      }
  };
  
  // Animate exit with circular curve (matches your React version exactly)
  const animateExit = () => {
      const { width, height } = setDimension();
      
      // Create timeline for synchronized animations
      const tl = gsap.timeline();
      
      // Animate the SVG path to flatten the curve
      tl.to(svgPath, {
          attr: { 
              d: `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height} 0 ${height} L0 0`
          },
          duration: 0.7,
          ease: "power2.inOut"
      }, 0);
      
      // Slide up the entire preloader (matches your Framer Motion animation)
      tl.to(preloader, {
          y: '-100%',
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.3, // Matches your 0.3s delay
          onComplete: () => {
              preloader.style.display = 'none';
              content.style.display = 'block';
              document.body.style.cursor = 'default';
              window.scrollTo(0, 0);
          }
      });
      
      // Fade out text to match your opacity animation
      tl.to('.preloader-text', {
          opacity: 0,
          duration: 0.3
      }, 0.5);
  };
  
  // Initialize
  setSvgPath();
  animateText();
  cycleWords();
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setSvgPath, 100);
  });
  
  // Start exit animation after 2 seconds (matches your React version)
  setTimeout(() => {
      animateExit();
  }, 2000);
});



// Animation for the profile sectoin text
document.addEventListener('DOMContentLoaded', function() {
  const typingContent = document.querySelector('.typing-content');
  const professions = ['Web Developer', 'Vibe Coder', 'AI Enthusiast', 'Video Editor'];
  let currentIndex = 0;
  let isTyping = true;
  let currentText = '';
  let charIndex = 0;
  let typingSpeed = 200;  
let erasingSpeed = 100; 
let newTextDelay = 3000;

  function typeText() {
    if (charIndex < professions[currentIndex].length) {
      currentText += professions[currentIndex].charAt(charIndex);
      typingContent.textContent = currentText;
      charIndex++;
      setTimeout(typeText, typingSpeed);
    } else {
      // Finished typing, wait then start erasing
      setTimeout(eraseText, newTextDelay);
    }
  }

  function eraseText() {
    if (charIndex > 0) {
      currentText = currentText.substring(0, charIndex - 1);
      typingContent.textContent = currentText;
      charIndex--;
      setTimeout(eraseText, erasingSpeed);
    } else {
      // Finished erasing, move to next text
      currentIndex = (currentIndex + 1) % professions.length;
      setTimeout(typeText, typingSpeed);
    }
  }

  // Start the animation
  typeText();
});

// Background animation
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('fluid-canvas');
  const ctx = canvas.getContext('2d');
  let mouseX = 0;
  let mouseY = 0;
  const particles = [];
  const particleCount = 150;
  const color = '#cccccc';

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Particle class with automatic movement
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random() * 0.5 - 0.25;
      this.vy = Math.random() * 0.5 - 0.25;
      this.radius = Math.random() * 2 + 1;
      this.targetRadius = this.radius;
      this.baseX = this.x;
      this.baseY = this.y;
      this.angle = Math.random() * Math.PI * 2;
      this.floatSpeed = Math.random() * 0.02 + 0.01;
      this.floatDistance = Math.random() * 20 + 10;
    }

    update() {
      // Automatic floating movement
      this.angle += this.floatSpeed;
      this.baseX += Math.sin(this.angle * 0.5) * 0.2;
      this.baseY += Math.cos(this.angle * 0.7) * 0.2;
      
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (1 - dist / 200) * 10;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }

      // Return to floating position when mouse is far
      const returnForce = 0.05;
      this.vx += (this.baseX - this.x) * returnForce;
      this.vy += (this.baseY - this.y) * returnForce;

      // Apply friction
      this.vx *= 0.85;
      this.vy *= 0.85;
      
      // Update position
      this.x += this.vx;
      this.y += this.vy;
      
      // Size animation
      if (dist < 50) this.targetRadius = 4;
      else this.targetRadius = this.radius;
      
      this.radius += (this.targetRadius - this.radius) * 0.1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Canvas styling
  canvas.style.backgroundColor = 'transparent';
  ctx.globalCompositeOperation = 'lighter';
});
// Add this to your existing script.js
function initBurgerButtonVisibility() {
  const burgerButton = document.getElementById('burger-button');
  const atomSection = document.getElementById('ai-chat');
  
  // Only run on desktop
  if (window.innerWidth < 1200) return;
  
  let lastScrollPosition = window.scrollY;
  let isVisible = false;
  
  const checkVisibility = () => {
    const currentScrollPosition = window.scrollY;
    const atomSectionTop = atomSection.getBoundingClientRect().top + window.scrollY;
    const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
    
    // Show when scrolled down to atom section
    if (currentScrollPosition > atomSectionTop - window.innerHeight/2) {
      if (!isVisible) {
        burgerButton.classList.add('visible');
        isVisible = true;
      }
    } 
    // Hide when scrolled up near top
    else if (currentScrollPosition < 300 && scrollDirection === 'up') {
      if (isVisible) {
        burgerButton.classList.remove('visible');
        isVisible = false;
      }
    }
    
    lastScrollPosition = currentScrollPosition;
  };
  
  // Use GSAP's scroll trigger for smooth detection
  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: self => {
      checkVisibility();
    }
  });
  
  // Initial check
  checkVisibility();
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Your other initialization code...
  initBurgerButtonVisibility();
  
  // Add resize observer to handle screen size changes
  window.addEventListener('resize', initBurgerButtonVisibility);
});

// --- Magnetic Effect Implementation ---
function applyMagneticEffect(element) {
  // Detect if SVG or burger button for extra strength
  const isSVG = element.tagName.toLowerCase() === 'svg';
  const isBurger = element.id === 'burger-button';
  let strength;
  if (isBurger) {
    strength = 2.8; // Strongest for burger button
  } else if (isSVG) {
    strength = 2.2;
  } else {
    strength = 1.7;
  }

  let xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "elastic.out(1, 0.4)" });
  let yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "elastic.out(1, 0.4)" });

  function mouseMove(e) {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    xTo(x);
    yTo(y);
  }

  function mouseLeave() {
    xTo(0);
    yTo(0);
  }

  // Store listeners for potential removal
  element._magneticListeners = {
    mouseMove: mouseMove,
    mouseLeave: mouseLeave
  };

  element.addEventListener("mousemove", mouseMove);
  element.addEventListener("mouseleave", mouseLeave);
}

// Call this after DOM is loaded
// (Add to the main DOMContentLoaded handler, or as a new one)
document.addEventListener('DOMContentLoaded', () => {
  // ...other initialization code...

  // Function to apply magnetic effects based on screen size
  function initializeMagneticEffects() {
    document.querySelectorAll('.magnetic').forEach(el => {
      const isToggleSwitch = el.classList.contains('toggle-switch');
      const isMobile = window.innerWidth <= 768;
      
      // Remove existing magnetic effect listeners if they exist
      if (el._magneticListeners) {
        el.removeEventListener("mousemove", el._magneticListeners.mouseMove);
        el.removeEventListener("mouseleave", el._magneticListeners.mouseLeave);
        delete el._magneticListeners;
        // Reset position
        gsap.set(el, { x: 0, y: 0 });
      }
      
      // Skip magnetic effect for toggle switch on mobile
      if (isToggleSwitch && isMobile) {
        return;
      }
      
      applyMagneticEffect(el);
    });
  }

  // Apply magnetic effect to all elements with the 'magnetic' class (SVGs and images)
  // Exclude dark mode toggle on mobile screens
  initializeMagneticEffects();
  
  // Re-initialize on window resize
  window.addEventListener('resize', initializeMagneticEffects);
});

document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('nav');
  const hamburgerNav = document.getElementById('hamburger-nav');
  const heroSection = document.querySelector('.hero-section');
  const burgerButton = document.querySelector('.burger-button');

  function adjustLayout() {
    // Desktop nav
    if (nav) {
      nav.style.position = 'absolute';
      nav.style.top = '0';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.zIndex = '10';
    }

    // Mobile nav (scrolls with page)
    if (hamburgerNav) {
      hamburgerNav.style.position = 'absolute';
      hamburgerNav.style.top = '0';
      hamburgerNav.style.left = '0';
      hamburgerNav.style.right = '0';
      hamburgerNav.style.zIndex = '10';
    }

    // Burger button stays fixed
    if (burgerButton) {
      burgerButton.style.position = 'fixed';
      burgerButton.style.top = '20px';
      burgerButton.style.right = '20px';
      burgerButton.style.zIndex = '2000';
    }

    // Hero section adjustment
    if (heroSection) {
      const navHeight = window.innerWidth >= 1200 ? 
        (nav ? nav.offsetHeight : 0) : 
        (hamburgerNav ? hamburgerNav.offsetHeight : 0);
      
      heroSection.style.position = 'relative';
      heroSection.style.zIndex = '20';
      heroSection.style.marginTop = `-${navHeight}px`;
    }
  }

  adjustLayout();
  window.addEventListener('resize', adjustLayout);

  // Optional scroll effect
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const currentNav = window.innerWidth >= 1200 ? nav : hamburgerNav;
    
    if (currentNav) {
      currentNav.style.background = scrollPosition > 50 ? 
        '#cccccc' : 
        '#cccccc';
    }
  });
});

// --- Animated Projects Modal & Cursor ---
class AnimatedProjects {
    constructor() {
        this.modal = { active: false, index: 0 };
        this.modalContainer = document.getElementById('modalContainer');
        this.modalSlider = document.getElementById('modalSlider');
        this.cursor = document.getElementById('cursor');
        this.cursorLabel = document.getElementById('cursorLabel');
        this.projectItems = document.querySelectorAll('.project-item');
        this.init();
    }
    init() {
        this.projectItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                this.setModal(true, index);
            });
            item.addEventListener('mouseleave', () => {
                this.setModal(false, index);
            });
            // Add click handler to open project link
            item.addEventListener('click', () => {
                const link = item.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank');
                }
            });
        });
        this.setupMouseTracking();
    }
    setModal(active, index) {
        this.modal = { active, index };
        if (active) {
            this.modalContainer.classList.add('active');
            this.cursor.classList.add('active');
            this.cursorLabel.classList.add('active');
            this.modalSlider.style.top = `${index * -100}%`;
        } else {
            this.modalContainer.classList.remove('active');
            this.cursor.classList.remove('active');
            this.cursorLabel.classList.remove('active');
        }
    }
    setupMouseTracking() {
        let mouseX = 0;
        let mouseY = 0;
        let modalX = 0;
        let modalY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let cursorLabelX = 0;
        let cursorLabelY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        const animate = () => {
            // Modal container animation (faster)
            modalX += (mouseX - modalX) * 0.3;
            modalY += (mouseY - modalY) * 0.3;
            // Cursor animation (faster)
            cursorX += (mouseX - cursorX) * 0.4;
            cursorY += (mouseY - cursorY) * 0.4;
            // Cursor label animation (faster)
            cursorLabelX += (mouseX - cursorLabelX) * 0.5;
            cursorLabelY += (mouseY - cursorLabelY) * 0.5;
            if (this.modalContainer) {
                this.modalContainer.style.left = modalX + 'px';
                this.modalContainer.style.top = modalY + 'px';
            }
            if (this.cursor) {
                this.cursor.style.left = cursorX + 'px';
                this.cursor.style.top = cursorY + 'px';
            }
            if (this.cursorLabel) {
                this.cursorLabel.style.left = cursorLabelX + 'px';
                this.cursorLabel.style.top = cursorLabelY + 'px';
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('modalContainer')) {
        new AnimatedProjects();
    }
});

// Text Reveal Animation
function initTextReveal() {
    // Select all elements that should have the reveal animation
    const revealElements = [
        ...document.querySelectorAll('.section__text__p1'),
        ...document.querySelectorAll('.title'),
        ...document.querySelectorAll('.experience-sub-title'),
        ...document.querySelectorAll('.project-title'),
        ...document.querySelectorAll('.project-description'),
        ...document.querySelectorAll('.timeline-content h3'),
        ...document.querySelectorAll('.timeline-content p'),
        ...document.querySelectorAll('.details-container h3'),
        ...document.querySelectorAll('.details-container p'),
        ...document.querySelectorAll('.text-container p'),
        ...document.querySelectorAll('.hero-title span')
    ];

    // For About section paragraphs and details-container p, animate the whole block, not word-by-word
    const aboutParagraphs = [
        ...document.querySelectorAll('#about .details-container p'),
        ...document.querySelectorAll('#about .text-container p')
    ];
    aboutParagraphs.forEach(element => {
        if (!element.classList.contains('line-mask')) {
            element.innerHTML = `<span class="line-mask">${element.innerHTML}</span>`;
        }
    });

    // For other elements, keep word-by-word animation
    revealElements.forEach(element => {
        // Skip if already handled above
        if (aboutParagraphs.includes(element)) return;
        if (element.querySelector('.line-mask')) return;
        const text = element.textContent;
        element.innerHTML = '';
        const words = text.split(' ');
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'line-mask';
            wordSpan.textContent = word + ' ';
            element.appendChild(wordSpan);
        });
    });

    // Animate the elements when they come into view
    // Only enhance About section .line-mask elements
    const aboutLineMasks = document.querySelectorAll('#about .line-mask');
    aboutLineMasks.forEach((span, i) => {
        gsap.set(span, { y: '100%', opacity: 0 });
        ScrollTrigger.create({
            trigger: span,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(span, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    delay: i * 0.12
                });
            }
        });
    });

    // Animate other .line-mask elements as before
    gsap.utils.toArray('.line-mask').forEach((span) => {
        if (span.closest('#about')) return; // skip About section, already handled
        gsap.set(span, { y: '100%' });
        ScrollTrigger.create({
            trigger: span,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(span, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power3.out'
                });
            }
        });
    });

    // Hero title animation (special case)
    const heroTitleSpans = document.querySelectorAll('.hero-title .line-mask');
    heroTitleSpans.forEach((span, i) => {
        gsap.to(span, {
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.2
        });
    });
}

// TEXT PARALLAX EFFECT
function initTextParallax() {
    const parallaxContainer = document.getElementById('parallax-container');
    if (!parallaxContainer) return;

    const slides = parallaxContainer.querySelectorAll('.parallax-slide');
    
    slides.forEach((slide, index) => {
        const direction = slide.dataset.direction;
        const leftOffset = slide.dataset.left;
        
        // Set initial position
        gsap.set(slide, { 
            left: leftOffset,
            x: direction === 'right' ? '-100%' : '0%'
        });
        
        // Create scroll-triggered animation
        gsap.to(slide, {
            x: direction === 'right' ? '0%' : '-100%',
            ease: 'none',
            scrollTrigger: {
                trigger: parallaxContainer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    // Additional smooth movement based on scroll progress
                    const progress = self.progress;
                    const moveAmount = direction === 'right' ? 
                        progress * 100 - 100 : 
                        progress * -100;
                    gsap.set(slide, { x: `${moveAmount}%` });
                }
            }
        });
    });
}

// SVG TEXT ANIMATION
function initSVGTextAnimation() {
    const svgContainer = document.getElementById('svg-container');
    const textPaths = document.querySelectorAll('.text-path');
    const svgText = document.querySelector('.svg-text');
    
    if (!svgContainer || textPaths.length === 0) return;
    
    // Function to update gradient based on dark mode
    function updateGradient() {
        if (svgText) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            svgText.setAttribute('fill', isDarkMode ? 'url(#textGradientDark)' : 'url(#textGradient)');
        }
    }
    
    // Initial gradient setup
    updateGradient();
    
    // Listen for dark mode changes
    const observer = new MutationObserver(updateGradient);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    // Create ScrollTrigger for the SVG text animation
    ScrollTrigger.create({
        trigger: svgContainer,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            
            // Animate each text path with proper spacing to avoid overlap
            textPaths.forEach((path, index) => {
                // Use larger spacing to prevent overlap (60% instead of 40%)
                const baseOffset = index * 60; // 60% spacing between texts
                const scrollOffset = progress * 60; // Move 60% based on scroll
                const newOffset = -60 + baseOffset + scrollOffset;
                
                // Ensure the offset wraps around properly with 180% total range
                let wrappedOffset = newOffset % 180;
                if (wrappedOffset < -60) {
                    wrappedOffset += 180;
                } else if (wrappedOffset > 120) {
                    wrappedOffset -= 180;
                }
                
                path.setAttribute('startOffset', `${wrappedOffset}%`);
            });
        }
    });
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTextReveal();
  initTextParallax();
  initSVGTextAnimation();
});