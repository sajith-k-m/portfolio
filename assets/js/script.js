// Parallax Effect & Smooth Flow
let scrollY = 0;
let targetScrollY = 0;
const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');
const blob3 = document.querySelector('.blob-3');

// Smooth easing function (Lerp)
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateParallax() {
    // Interpolate current scroll towards target
    scrollY = lerp(scrollY, targetScrollY, 0.1); // 0.1 = smoothness factor

    if (blob1) blob1.style.transform = `translate(0px, ${scrollY * 0.2}px)`;
    if (blob2) blob2.style.transform = `translate(0px, -${scrollY * 0.2}px)`;
    if (blob3) blob3.style.transform = `translate(0px, ${scrollY * 0.15}px)`;

    // Pill Parallax (Footer)
    const pills = document.querySelectorAll('.pill-link');
    pills.forEach((pill, index) => {
        // Only apply if footer is somewhat visible or just global? Global is cooler for "flow".
        // Use CSS var to avoid overwriting rotation/hover scale
        const speed = 0.05 + (index * 0.02);
        pill.style.setProperty('--translate-y', `${scrollY * speed * -0.2}px`);
    });

    requestAnimationFrame(updateParallax);
}

// Start Animation Loop
updateParallax();

// Update target on scroll
window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
});

// Initialize AOS Animation Library
AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 100
});

// GSAP Entrance for Pills
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.from(".pill-link", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.5)",
                clearProps: "all" // Important: allow hover/parallax to take over after anim
            });
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const footerSection = document.querySelector('.footer-section');
if (footerSection) {
    footerObserver.observe(footerSection);
}

// Theme Toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';

    // Animate hamburger
    const bars = document.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.style.display = 'none';

        // Reset hamburger
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Scroll active link highlighter
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Initialize Decrypted Text Animation
document.addEventListener('DOMContentLoaded', () => {
    // Check if DecryptedText is available
    if (typeof DecryptedText !== 'undefined') {
        new DecryptedText('#role-text-1', {
            text: 'Aspiring Software Engineer &',
            animateOn: 'view',
            revealDirection: 'start',
            speed: 50,
            maxIterations: 10,
            sequential: true
        });

        new DecryptedText('#role-text-2', {
            text: 'Web Developer',
            animateOn: 'view',
            revealDirection: 'start',
            speed: 60,
            maxIterations: 15,
            className: 'highlight', // Ensures the revealed text keeps the highlight color
            sequential: true
        });
    }

    // Force Smooth Scroll for Pills (Defensive Fix with Delegation)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.pill-link');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href');
        console.log('Pill clicked:', targetId);

        if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

        try {
            const targetSection = document.querySelector(targetId);
            const header = document.querySelector('header');

            if (targetSection) {
                // Get header height dynamically or assume a safe fixed value
                const headerHeight = header ? header.offsetHeight : 80;

                // Calculate position
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                console.log('Scrolling to:', offsetPosition);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            } else {
                console.warn('Target section not found:', targetId);
                window.location.hash = targetId; // Fallback
            }
        } catch (err) {
            console.error('Scroll error:', err);
            window.location.hash = targetId; // Fallback
        }
    });
});
