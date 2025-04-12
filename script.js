import { GEMINI_API_KEY } from './config.js';

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
  gsap.from("#ai-chat .chat-messages, #ai-chat .chat-input", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#ai-chat",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse",
    },
  });

  gsap.registerPlugin(ScrollTrigger);

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

  gsap.from("#projects .color-container", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#projects",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  });

  gsap.fromTo("#interests .about-details-container",
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
        trigger: "#interests",
        start: "top center+=100",
        end: "top center-=100",
        toggleActions: "play none none reverse"
      }
    }
  );

  gsap.from("#interests .details-container", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#interests",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  });

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

  gsap.from("#contact .contact-info-container", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    scrollTrigger: {
      trigger: "#contact",
      start: "top center+=100",
      end: "top center-=100",
      toggleActions: "play none none reverse"
    }
  });
});

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
  
  const words = ["Hello", "Hola", "Bonjour","olá","こんにちは", "नमस्ते", "নমস্কার","ہیلو", "合禮"];
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