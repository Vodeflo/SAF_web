// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change and hide/show on scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const currentY = window.scrollY;
    if (currentY > 100) {
        navbar.style.background = 'rgba(13, 17, 23, 0.85)';
        navbar.style.boxShadow = '0 1px 0 var(--border-color)';
        navbar.classList.toggle('hidden', currentY > lastScrollY);
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.85)';
        navbar.style.boxShadow = 'none';
        navbar.classList.remove('hidden');
    }
    lastScrollY = currentY;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .gallery-item, .community-link');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.pixel-grid');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Home panel wipe-on-scroll behavior
(function initHomePanelWipe(){
    const panel = document.querySelector('.home-panel');
    if (!panel) return;
    let lastY = window.scrollY;

    function update() {
        const y = window.scrollY;
        const hero = document.querySelector('#home');
        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        // Progress through first 40% of hero height
        const progress = Math.min(1, Math.max(0, y / (heroHeight * 0.4)));
        // Direction-aware easing: faster wipe on scroll down, slower restore on up
        const goingDown = y > lastY;
        const eased = goingDown ? Math.pow(progress, 0.7) : Math.pow(progress, 1.4);
        panel.style.setProperty('--wipe', eased.toFixed(4));
        panel.classList.toggle('wiped', eased > 0.95);
        lastY = y;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
})();

// Spotlight cursor tracking
const spotlightEl = document.querySelector('.spotlight');
window.addEventListener('mousemove', (e) => {
    if (!spotlightEl) return;
    document.documentElement.style.setProperty('--spot-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--spot-y', e.clientY + 'px');
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const titleElement = document.querySelector('.title-main');
    if (titleElement) {
        const originalText = titleElement.textContent;
        typeWriter(titleElement, originalText, 150);
    }
});

// Particle system for hero background
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#00ff88';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.opacity = '0.7';
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    const endY = -10;
    const duration = Math.random() * 3000 + 2000;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    document.querySelector('.floating-particles').appendChild(particle);
    
    particle.animate([
        { transform: `translateY(0px)`, opacity: 0.7 },
        { transform: `translateY(${endY - startY}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => {
        particle.remove();
    };
}

// Create particles periodically
setInterval(createParticle, 500);

// Modal gallery with navigation
function initModalGallery() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    const images = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = -1;

    if (!modal || !modalImg || images.length === 0) return;

    function openAt(index) {
        currentIndex = (index + images.length) % images.length;
        const img = images[currentIndex];
        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        document.body.style.overflow = '';
    }

    function showNext() { openAt(currentIndex + 1); }
    function showPrev() { openAt(currentIndex - 1); }

    images.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openAt(idx));
    });

    closeBtn?.addEventListener('click', close);
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    document.addEventListener('keydown', (e) => {
        if (modal.getAttribute('aria-hidden') === 'true') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

// Download button click tracking
document.querySelectorAll('.download-btn, .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        // Track download clicks (you can integrate with analytics here)
        console.log('Download button clicked');
    });
});

// Feature cards hover effect enhancement
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Community links hover effect
document.querySelectorAll('.community-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #00ff88, #4ecdc4)';
    progressBar.style.zIndex = '1001';
    progressBar.style.transition = 'width 0.1s ease-out';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close any open lightboxes
        const lightboxes = document.querySelectorAll('[style*="position: fixed"]');
        lightboxes.forEach(lb => {
            if (lb.style.background === 'rgba(0, 0, 0, 0.9)') {
                lb.remove();
            }
        });
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.pixel-grid');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}, 16)); // ~60fps

// Preload critical images (if any are added later)
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();

// Custom cursor trail effect
function createCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.background = `hsl(${280 + i * 2}, 70%, 60%)`;
        dot.style.borderRadius = '50%';
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '9999';
        dot.style.opacity = (trailLength - i) / trailLength;
        dot.style.transition = 'opacity 0.1s ease-out';
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || { offsetLeft: x, offsetTop: y };
            x += (nextDot.offsetLeft - x) * 0.3;
            y += (nextDot.offsetTop - y) * 0.3;
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Initialize cursor trail
createCursorTrail();

// Enhanced particle system
function createEnhancedParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${280 + Math.random() * 40}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px currentColor`;
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endY = -10;
        const duration = Math.random() * 4000 + 3000;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        particleContainer.appendChild(particle);
        
        particle.animate([
            { 
                transform: `translateY(0px) rotate(0deg) scale(1)`, 
                opacity: particle.style.opacity 
            },
            { 
                transform: `translateY(${endY - startY}px) rotate(360deg) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    // Create particles more frequently
    setInterval(createParticle, 300);
}

// Initialize enhanced particles
createEnhancedParticles();

// Testimonial Slider
class TestimonialSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.showSlide(0);
        this.setupEventListeners();
        this.startAutoSlide();
    }
    
    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause auto-slide on hover
        const slider = document.querySelector('.testimonials-slider');
        slider?.addEventListener('mouseenter', () => this.stopAutoSlide());
        slider?.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Interactive mouse effects for new sections
function initMouseEffects() {
    const interactiveElements = document.querySelectorAll('.mode-card, .testimonial-card, .feature-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            createRipple(e, element);
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(168, 85, 247, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
    initMouseEffects();
    initCommandPalette();
    initTiltEffects();
    initMagneticHover();
    initRoadmapProgress();
    initFAQ();
    initStarfield();
    initScrollSpy();
    enhanceBackToTopWithProgress();
    initBlurUpImages();
    initGalleryImageTilt();
  initGalleryShine();
    initRevealOnScroll();
    initConfettiOnButtons();
});

// Console welcome message
console.log(`
🎮 Welcome to SAF Game Website! 🎮
Built with ❤️ for the gaming community
Visit: https://vodeflo.itch.io/saf
`);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}

// 3D tilt effect for cards and gallery items
function initTiltEffects() {
    const tiltElements = document.querySelectorAll('.feature-card, .mode-card, .gallery-item');
    const maxTilt = 10; // degrees
    tiltElements.forEach((el) => {
        el.classList.add('tilt');
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            el.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
            el.classList.add('tilt-shadow');
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.classList.remove('tilt-shadow');
        });
    });
}

// Roadmap progress bars animation on intersection
function initRoadmapProgress() {
  const bars = document.querySelectorAll('.roadmap .progress span');
  if (bars.length === 0) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target') || '0');
      requestAnimationFrame(() => { el.style.width = Math.min(100, Math.max(0, target)) + '%'; });
      obs.unobserve(el);
    });
  }, { threshold: 0.35 });

  bars.forEach(b => io.observe(b));
}

// Magnetic hover for buttons and navbar search
function initMagneticHover() {
    const magneticElements = document.querySelectorAll('.btn, .download-btn, .nav-search');
    const strength = 20;
    magneticElements.forEach((el) => {
        el.classList.add('magnetic');
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// Command Palette (Ctrl+K)
function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('cmdp-input');
    const list = document.getElementById('cmdp-list');
    const searchBtn = document.querySelector('.nav-search');
    let activeIndex = 0;

    function openPalette() {
        if (!palette) return;
        palette.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        input.value = '';
        filterItems('');
        input.focus();
    }

    function closePalette() {
        if (!palette) return;
        palette.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function filterItems(query) {
        const q = query.trim().toLowerCase();
        const items = Array.from(list.querySelectorAll('li'));
        items.forEach((item) => {
            const text = item.innerText.toLowerCase();
            const match = text.includes(q);
            item.style.display = match ? '' : 'none';
            item.removeAttribute('aria-selected');
        });
        activeIndex = 0;
        const visibles = items.filter(i => i.style.display !== 'none');
        if (visibles[0]) visibles[0].setAttribute('aria-selected', 'true');
    }

    function activate(item) {
        const action = item.getAttribute('data-action') || '';
        if (action.startsWith('nav:')) {
            const target = document.querySelector(action.replace('nav:', ''));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (action.startsWith('link:')) {
            window.open(action.replace('link:', ''), '_blank');
        }
        closePalette();
    }

    input?.addEventListener('input', (e) => filterItems(e.target.value));

    list?.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) activate(li);
    });

    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const metaK = (isMac && e.metaKey && e.key.toLowerCase() === 'k');
        const ctrlK = (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');
        if (metaK || ctrlK) {
            e.preventDefault();
            openPalette();
        }
        if (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
            e.preventDefault();
            openPalette();
        }
        if (palette?.getAttribute('aria-hidden') === 'false') {
            const items = Array.from(list.querySelectorAll('li')).filter(i => i.style.display !== 'none');
            if (e.key === 'Escape') closePalette();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                items[activeIndex]?.removeAttribute('aria-selected');
                activeIndex = (activeIndex + 1) % items.length;
                items[activeIndex]?.setAttribute('aria-selected', 'true');
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                items[activeIndex]?.removeAttribute('aria-selected');
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                items[activeIndex]?.setAttribute('aria-selected', 'true');
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const current = items[activeIndex];
                if (current) activate(current);
            }
        }
    });

    searchBtn?.addEventListener('click', openPalette);
}

// Initialize modal gallery and back-to-top on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initModalGallery();
  initBackToTop();
});

// Back-to-Top button behavior
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const toggle = () => {
    const show = window.scrollY > 400;
    btn.classList.toggle('show', show);
  };
  toggle();
  window.addEventListener('scroll', throttle(toggle, 100));
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// (scramble removed)

// Starfield background
function initStarfield() {
  const canvas = document.querySelector('.starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0, height = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running = true;

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const base = prefersReduced ? 35000 : 20000; // fewer stars if reduced motion
    const count = Math.floor((width * height) / base);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.6 + 0.4,
      vx: (Math.random() - 0.5) * (prefersReduced ? 0.04 : 0.1),
      vy: (Math.random() - 0.5) * (prefersReduced ? 0.04 : 0.1),
      s: Math.random() * 1.2 + 0.2
    }));
  }

  function tick() {
    if (!running) {
      requestAnimationFrame(tick);
      return;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    stars.forEach(star => {
      star.x += star.vx * star.z;
      star.y += star.vy * star.z;
      if (star.x < 0) star.x += width; if (star.x > width) star.x -= width;
      if (star.y < 0) star.y += height; if (star.y > height) star.y -= height;
      const r = star.s * star.z;
      ctx.globalAlpha = 0.5 * star.z;
      ctx.beginPath();
      ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', throttle(resize, 150));
  document.addEventListener('visibilitychange', () => { running = document.visibilityState === 'visible'; });
  resize();
  tick();
}

// ScrollSpy for navbar
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = Array.from(document.querySelectorAll('.nav-link'));
  if (sections.length === 0 || links.length === 0) return;

  const map = new Map();
  links.forEach(l => {
    const href = l.getAttribute('href') || '';
    if (href.startsWith('#')) map.set(href.slice(1), l);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => a.classList.remove('active'));
      const link = map.get(id);
      if (link) link.classList.add('active');
    });
  }, { threshold: 0.55 });

  sections.forEach(s => io.observe(s));
}

// Back-to-top with progress ring
function enhanceBackToTopWithProgress() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  if (!btn.querySelector('svg')) {
    btn.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28"></circle></svg>');
  }
  const circle = btn.querySelector('circle');
  const length = 2 * Math.PI * 28; // matches stroke-dasharray in CSS (approx 176)
  circle.style.strokeDasharray = String(length);
  function update() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    circle.style.strokeDashoffset = String(length * (1 - p));
  }
  update();
  window.addEventListener('scroll', throttle(update, 50), { passive: true });
}

// Blur-up lazy loading for gallery images
function initBlurUpImages() {
    document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.filter = 'blur(10px)';
    img.style.transform = 'scale(1.02)';
    img.style.transition = 'filter 300ms ease, transform 300ms ease';
    if (img.complete) clear(); else img.addEventListener('load', clear, { once: true });
    function clear() {
      img.style.filter = 'blur(0)';
      img.style.transform = 'scale(1)';
    }
  });
}

// Subtle tilt for gallery screenshots based on cursor position
function initGalleryImageTilt() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const images = document.querySelectorAll('.gallery-item .gallery-placeholder img');
  if (images.length === 0) return;

  images.forEach((img) => {
    const wrap = img.closest('.gallery-placeholder') || img.parentElement;
    if (!wrap) return;
    wrap.style.perspective = '900px';

    let rafId = 0;
    let targetRX = 0, targetRY = 0, targetSX = 0, targetSY = 0;
    let currentRX = 0, currentRY = 0, currentSX = 0, currentSY = 0;
    const maxTilt = prefersReduced ? 4 : 8;
    const shadowScale = prefersReduced ? 8 : 16;

    function animate() {
      currentRX += (targetRX - currentRX) * 0.15;
      currentRY += (targetRY - currentRY) * 0.15;
      currentSX += (targetSX - currentSX) * 0.2;
      currentSY += (targetSY - currentSY) * 0.2;
      img.style.transform = `rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg) scale(1.02)`;
      const dx = currentSY; // use smoothed values for shadow
      const dy = currentSX;
      img.style.filter = `drop-shadow(${dx.toFixed(1)}px ${dy.toFixed(1)}px 14px rgba(0,0,0,0.35))`;
      rafId = requestAnimationFrame(animate);
    }

    function onMove(e) {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const ry = (px - 0.5) * (maxTilt * 2);
      const rx = (0.5 - py) * (maxTilt * 2);
      targetRX = rx;
      targetRY = ry;
      targetSX = (px - 0.5) * shadowScale;
      targetSY = (py - 0.5) * shadowScale;
    }

    function onLeave() {
      targetRX = 0; targetRY = 0; targetSX = 0; targetSY = 0;
    }

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);

    if (!prefersReduced) animate();
  });
}

// Interactive shine that follows cursor on gallery placeholders
function initGalleryShine() {
  const items = document.querySelectorAll('.gallery-placeholder');
  if (items.length === 0) return;
  items.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--shine-x', x + '%');
      el.style.setProperty('--shine-y', y + '%');
    });
  });
}

// Highlights slider with autoplay + drag
// highlights slider removed

// Reveal-on-scroll utility
function initRevealOnScroll() {
  const revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length === 0) return;
  revealables.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity 600ms ease, transform 600ms ease'; });
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealables.forEach(el => io.observe(el));
}

// Confetti burst on key button clicks
function initConfettiOnButtons() {
  const targets = document.querySelectorAll('.btn-primary, .download-btn');
  if (targets.length === 0) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  targets.forEach(btn => btn.addEventListener('click', (e) => {
    if (prefersReduced) return;
    const rect = btn.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width/2, rect.top + window.scrollY);
  }));
}
function spawnConfetti(x, y) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.pointerEvents = 'none';
  container.style.width = '100%';
  container.style.height = '0';
  document.body.appendChild(container);
  const count = 36; // lighter
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.width = '6px';
    p.style.height = '6px';
    p.style.borderRadius = Math.random() < 0.5 ? '50%' : '2px';
    p.style.background = `hsl(${Math.floor(180 + Math.random()*180)}, 80%, 60%)`;
    p.style.transform = 'translate(-50%, -50%)';
    container.appendChild(p);
    const dx = (Math.random() - 0.5) * 280;
    const dy = (-Math.random()) * 320 - 80;
    p.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random()*720-360}deg) scale(${Math.random()*0.6+0.7})`, opacity: 0 }
    ], { duration: 900 + Math.random()*400, easing: 'cubic-bezier(0.2,0,0.2,1)' });
  }
  setTimeout(() => container.remove(), 1400);
}

// FAQ accordion
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (items.length === 0) return;
  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if (!btn || !panel) return;
    // Set initial height for closed state
    panel.style.height = '0px';
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        const b = i.querySelector('.faq-question');
        const p = i.querySelector('.faq-answer');
        if (!p || !b) return;
        i.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
        p.style.height = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
      }
    });
  });
}
  