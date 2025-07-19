// Project data for stacking cards
const stackingProjects = [
  {
    title: "Frontend Development",
    description: "Experienced in modern frontend technologies including HTML5, CSS3, JavaScript ES6+, React.js, and Next.js. I create responsive, interactive user interfaces with a focus on performance and user experience.",
    src: "https://wearebrain.com/wp-content/uploads/2023/01/Frontend-trends-for-2023.png?w=800&h=600&fit=crop",
    link: "#projects",
    color: "#fafafa"
  },
  {
    title: "Backend Development",
    description: "Proficient in server-side development using Node.js, Express.js, and various databases. I build scalable APIs and robust backend systems that power modern web applications.",
    src: "https://wearebrain.com/wp-content/uploads/2023/09/GANs-and-content-creation.png?w=800&h=600&fit=crop",
    link: "#projects",
    color: "#fafafa"
  },
  {
    title: "Full Stack Projects",
    description: "I combine frontend and backend expertise to create complete web applications. From concept to deployment, I handle the entire development lifecycle with modern tools and best practices.",
    src: "https://wearebrain.com/wp-content/uploads/2025/05/From-web-development-to-app-development.png?w=800&h=600&fit=crop",
    link: "#projects",
    color: "#fafafa"
  },
  {
    title: "Video Editing",
    description: "Creative video editing using DaVinci Resolve and CapCut. I craft engaging visual stories that capture attention and convey powerful messages through professional editing techniques.",
    src: "https://wearebrain.com/wp-content/uploads/2024/02/AI-Video-Production-e1715177777400.png?w=800&h=600&fit=crop",
    link: "#interests",
    color: "#fafafa"
  },
  // {
  //   title: "AI & Innovation",
  //   description: "Passionate about artificial intelligence and emerging technologies. I explore machine learning, natural language processing, and AI integration to build intelligent, future-ready applications.",
  //   src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  //   link: "#ai-chat",
  //   color: "#4facfe"
  // }
];

// Utility function to map values from one range to another
function mapRange(value, in_min, in_max, out_min, out_max) {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

// Clamp function to keep values within bounds
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Card animation controller
class StackingCardAnimations {
  constructor() {
    this.cards = [];
    this.container = document.getElementById('stacking-container');
    this.init();
  }

  init() {
    this.createCards();
    this.setupScrollListener();
  }

  createCards() {
    stackingProjects.forEach((project, index) => {
      const cardElement = this.createCardElement(project, index);
      this.container.appendChild(cardElement);
      this.cards.push({
        element: cardElement,
        index: index,
        project: project
      });
    });
    this.applyDarkModeToCards();
    this.setupDarkModeListener();
  }
  applyDarkModeToCards() {
    const isDark = document.body.classList.contains('dark-mode');
    this.cards.forEach(cardData => {
      const card = cardData.element.querySelector('.stacking-card');
      if (isDark) {
        card.style.backgroundColor = '#121212';
        card.style.border = '2px solid #fff';
      } else {
        card.style.backgroundColor = cardData.project.color;
        card.style.border = '2px solid rgb(163, 163, 163)';
      }
    });
  }

  setupDarkModeListener() {
    // Listen for dark mode toggle (assumes toggle adds/removes 'dark-mode' on body)
    const observer = new MutationObserver(() => {
      this.applyDarkModeToCards();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  createCardElement(project, index) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'stacking-card-container';
    cardContainer.style.animationDelay = `${index * 0.1}s`;

    const card = document.createElement('div');
    card.className = 'stacking-card';
    card.style.backgroundColor = project.color;
    card.style.top = `calc(-5vh + ${index * 25}px)`;
    card.style.border = '2px solid rgb(163, 163, 163)';

    card.innerHTML = `
      <h2>${project.title}</h2>
      <div class="stacking-card-body">
        <div class="stacking-description">
          <p>${project.description}</p>
          <div class="link-container">
          </div>
        </div>
        <div class="stacking-image-container">
          <div class="stacking-image-inner">
            <img src="${project.src}" alt="${project.title}" loading="lazy">
          </div>
        </div>
      </div>
    `;

    cardContainer.appendChild(card);
    return cardContainer;
  }

  setupScrollListener() {
    let ticking = false;

    const updateAnimations = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      this.cards.forEach((cardData, index) => {
        const { element } = cardData;
        const card = element.querySelector('.stacking-card');
        const imageInner = element.querySelector('.stacking-image-inner');
        const cardContainer = element;

        // Get the card's position relative to viewport
        const containerTop = cardContainer.offsetTop;
        const containerHeight = cardContainer.offsetHeight;

        // Calculate individual card image scale progress
        const imageScaleStart = containerTop - windowHeight;
        const imageScaleEnd = containerTop;
        let imageProgress = (scrollY - imageScaleStart) / (imageScaleEnd - imageScaleStart);
        imageProgress = clamp(imageProgress, 0, 1);

        // Image scale: from 2 to 1 as it enters viewport
        const imageScale = mapRange(imageProgress, 0, 1, 2, 1);
        imageInner.style.transform = `scale(${imageScale})`;

        // Calculate overall container scroll progress for stacking
        const containerStart = this.container.offsetTop - windowHeight;
        const containerEnd = this.container.offsetTop + (this.cards.length * windowHeight);
        let containerProgress = (scrollY - containerStart) / (containerEnd - containerStart);
        containerProgress = clamp(containerProgress, 0, 1);

        // Card stacking animation
        const totalCards = this.cards.length;
        const targetScale = 1 - ((totalCards - index) * 0.05);

        // Each card starts scaling at different points
        const cardScaleStart = index * 0.25; // 0%, 25%, 50%, 75%
        const cardScaleRange = [cardScaleStart, 1];
        let cardScale = 1;

        if (containerProgress >= cardScaleStart) {
          const scaleProgress = mapRange(containerProgress, cardScaleStart, 1, 0, 1);
          cardScale = mapRange(clamp(scaleProgress, 0, 1), 0, 1, 1, targetScale);
        }

        card.style.transform = `scale(${cardScale})`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });

    // Initial call
    updateAnimations();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the stacking container exists before initializing
  if (document.getElementById('stacking-container')) {
    new StackingCardAnimations();
  }
});

// Add scroll indication for better UX
window.addEventListener('load', () => {
  // Only add scroll indicator if stacking container exists
  if (document.getElementById('stacking-container')) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 14px;
      opacity: 0.7;
      z-index: 1000;
      animation: stackingBounce 2s infinite;
    `;
    scrollIndicator.textContent = '↓ Scroll to explore';
    document.body.appendChild(scrollIndicator);

    // Add bounce animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes stackingBounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateX(-50%) translateY(0);
        }
        40% {
          transform: translateX(-50%) translateY(-10px);
        }
        60% {
          transform: translateX(-50%) translateY(-5px);
        }
      }
    `;
    document.head.appendChild(style);

    // Hide scroll indicator after some scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = '0';
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY < 100) {
          scrollIndicator.style.opacity = '0.7';
        }
      }, 1000);
    });
  }
});