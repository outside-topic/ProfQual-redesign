/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');

function handleScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== */
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger counter animation
            if (entry.target.querySelector('.metric-number')) {
                animateCounters(entry.target);
            }

            // Trigger process line
            if (entry.target.id === 'processSteps') {
                entry.target.classList.add('active');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
let countersAnimated = false;

function animateCounters(container) {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.metric-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            // Format number
            if (target >= 1000) {
                counter.textContent = current.toLocaleString() + suffix;
            } else {
                counter.textContent = current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

/* ===== HERO PARTICLES ===== */
const canvas = document.getElementById('heroParticles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}

function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.max(0.5, Math.random() * 2),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    animationId = requestAnimationFrame(drawParticles);
}

// Only run particles on larger screens
function initParticles() {
    if (window.innerWidth >= 768) {
        resizeCanvas();
        createParticles();
        drawParticles();
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        resizeCanvas();
        createParticles();
    } else {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

initParticles();

/* ===== TESTIMONIAL CAROUSEL ===== */
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentPage = 0;
const perPage = window.innerWidth >= 992 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
const totalPages = Math.ceil(slides.length / perPage);

function showPage(page) {
    currentPage = page;
    if (currentPage >= totalPages) currentPage = 0;
    if (currentPage < 0) currentPage = totalPages - 1;

    slides.forEach((slide, i) => {
        const start = currentPage * perPage;
        const end = start + perPage;
        if (i >= start && i < end) {
            slide.classList.remove('d-none');
            slide.classList.add('d-md-block');
        } else {
            slide.classList.add('d-none');
            slide.classList.remove('d-md-block');
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPage);
    });
}

function getPerPage() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function updateCarousel() {
    const newPerPage = getPerPage();
    const newTotalPages = Math.ceil(slides.length / newPerPage);
    if (currentPage >= newTotalPages) currentPage = 0;
    showPage(currentPage);
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showPage(currentPage - 1);
    });
}

if (nextBtn) {

    nextBtn.addEventListener('click', () => {
        showPage(currentPage + 1);
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        showPage(parseInt(dot.getAttribute('data-page')));
    });
});

window.addEventListener('resize', updateCarousel);
showPage(0);

/* ===== NEWSLETTER HANDLER ===== */
function handleNewsletter(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const email = input.value;
    if (email) {
        input.value = '';
        // Show inline success feedback
        const btn = e.target.querySelector('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg"></i>';
        btn.style.background = '#22C55E';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }
    return false;
}

/* ===== ACTIVE NAV LINK HIGHLIGHTING ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link-custom');

function highlightNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav, { passive: true });

/* ===== PRELOAD HERO ANIMATIONS ===== */
window.addEventListener('load', () => {
    // Trigger hero reveals immediately
    document.querySelectorAll('.hero-section .reveal, .hero-section .reveal-scale').forEach(el => {
        setTimeout(() => el.classList.add('active'), 200);
    });
});





const swiper = new Swiper('.featureSwiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        }
    },
});

new Swiper('.testimonialSwiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        }
    },
});
new Swiper('.feedbackSwiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 1,
        },
        992: {
            slidesPerView: 1,
        }
    },
});
new Swiper('.featureswiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 2,
        }
    },
});





