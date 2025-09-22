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

// Gallery lightbox effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.background = 'rgba(0, 0, 0, 0.9)';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.zIndex = '9999';
        lightbox.style.cursor = 'pointer';
        
        // Create content
        const content = document.createElement('div');
        content.style.background = 'white';
        content.style.padding = '2rem';
        content.style.borderRadius = '8px';
        content.style.maxWidth = '80%';
        content.style.maxHeight = '80%';
        content.style.textAlign = 'center';
        content.style.color = '#333';
        content.innerHTML = `
            <h3>Gallery Preview</h3>
            <p>This would show the actual game screenshot or video.</p>
            <p>Click anywhere to close.</p>
        `;
        
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
        
        // Close lightbox on click
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
    });
});

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
