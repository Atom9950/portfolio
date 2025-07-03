import { GEMINI_API_KEY } from './config.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animations
  initAnimations();
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

  // Work Experience Timeline Animation - Responsive
const workExperienceAnimations = () => {
  // Common ScrollTrigger configuration
  const triggerConfig = {
    trigger: "#work-experience",
    start: "top 80%",
    toggleActions: "play none none none",
    markers: false // Remove in production
  };

  // Mobile detection
  const isMobile = window.innerWidth < 768;

  // Timeline container animation
  gsap.from("#work-experience .timeline-container", {
    y: isMobile ? 30 : 60,
    opacity: 0,
    duration: isMobile ? 0.8 : 1,
    ease: "power3.out",
    scrollTrigger: triggerConfig
  });

  // Timeline dot animation (if you have dots)
  if (document.querySelector("#work-experience .timeline-dot")) {
    gsap.from("#work-experience .timeline-dot", {
      scale: 0,
      opacity: 0,
      duration: isMobile ? 0.4 : 0.6,
      delay: isMobile ? 0.1 : 0.3,
      scrollTrigger: triggerConfig
    });
  }

  // Timeline content animation
  gsap.from("#work-experience .timeline-content", {
    x: isMobile ? 40 : 100,
    opacity: 0,
    duration: isMobile ? 0.6 : 0.8,
    delay: isMobile ? 0.3 : 0.5,
    ease: "power2.out",
    scrollTrigger: triggerConfig
  });

  // Item stagger animation
  gsap.from("#work-experience .company-logo, #work-experience .experience-header, #work-experience .experience-details li", {
    y: isMobile ? 10 : 20,
    opacity: 0,
    duration: isMobile ? 0.3 : 0.4,
    stagger: isMobile ? 0.05 : 0.1,
    delay: isMobile ? 0.5 : 0.8,
    ease: "power2.out",
    scrollTrigger: triggerConfig
  });
};

// Initialize on load and resize
window.addEventListener('load', workExperienceAnimations);
window.addEventListener('resize', () => {
  // Kill existing animations before reinitializing
  ScrollTrigger.getAll().forEach(t => t.kill());
  workExperienceAnimations();
});

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



// Chat functionality with Gemini API integration
document.addEventListener('DOMContentLoaded', () => {
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

let menuLinks, hamburgerIcon;

function toggleMenu() {
  menuLinks.classList.toggle("open");
  hamburgerIcon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  menuLinks = document.querySelector(".menu-links");
  hamburgerIcon = document.querySelector(".hamburger-icon");

  hamburgerIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

  document.querySelectorAll(".menu-links a, .menu-links li").forEach((element) => {
    element.addEventListener("click", () => {
      menuLinks.classList.remove("open");
      hamburgerIcon.classList.remove("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !menuLinks.contains(event.target) &&
      !hamburgerIcon.contains(event.target)
    ) {
      menuLinks.classList.remove("open");
      hamburgerIcon.classList.remove("open");
    }
  });
});

let lastScrollTop = 0;
const hamburgerNav = document.getElementById("hamburger-nav");
const scrollThreshold = 5;

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
    hamburgerNav.style.top = "-100px";
  } else {
    hamburgerNav.style.top = "0";
  }

  lastScrollTop = scrollTop;
});

document.querySelectorAll('.icon-container').forEach(container => {
  const img = container.querySelector('.tech-icon');
  const tooltip = container.querySelector('.tooltip');
  tooltip.textContent = img.alt;
});

// Dark mode functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

const isDarkMode = localStorage.getItem("dark-mode") === "enabled";

if (isDarkMode) {
  body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled");
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
  const color = '#FFD700';

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