// Authentication & Profile Logic
const authLink = document.getElementById('authLink');
const navMenu = document.getElementById('navMenu');

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('burundiUser'));
    const navLinks = document.querySelectorAll('.nav-link');

    // Find the link that points to account or login
    navLinks.forEach(link => {
        if (link.href.includes('account.html') || link.href.includes('login.html')) {
            if (user) {
                link.textContent = 'Account';
                link.href = 'account.html';
            } else {
                link.textContent = 'Login';
                link.href = 'login.html';
            }
        }
    });

    // Populate Account Page
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.info-group:nth-child(1) .info-value span');

    if (user && profileName && profileEmail) {
        if (window.location.pathname.includes('account.html')) {
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;
        }
    }
}

// Login Form Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('loginName').value;
        const email = document.getElementById('loginEmail').value;

        localStorage.setItem('burundiUser', JSON.stringify({ name, email }));
        window.location.href = 'account.html';
    });
}

// Logout Logic
function logout() {
    localStorage.removeItem('burundiUser');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', updateAuthUI);

// Scroll-Gated Login
window.addEventListener('scroll', () => {
    const user = JSON.parse(localStorage.getItem('burundiUser'));
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('account.html');

    if (!user && !isAuthPage && window.scrollY > window.innerHeight * 1.5) {
        // Only redirect once
        if (!window.sessionStorage.getItem('scrollGateTriggered')) {
            window.sessionStorage.setItem('scrollGateTriggered', 'true');
            window.location.href = 'login.html?gate=true';
        }
    }
});

// Image Gallery Filter with transition
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                item.style.display = 'block';
                // Trigger animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const closeBtn = document.getElementById('lightboxClose');
const nextBtn = document.getElementById('lightboxNext');
const prevBtn = document.getElementById('lightboxPrev');

let currentImageIndex = 0;
const visibleImages = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

function openLightbox(index) {
    const images = visibleImages();
    currentImageIndex = index;
    const imgSrc = images[currentImageIndex].querySelector('img').src;
    const imgAlt = images[currentImageIndex].querySelector('img').alt;

    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNext() {
    const images = visibleImages();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openLightbox(currentImageIndex);
}

function showPrev() {
    const images = visibleImages();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openLightbox(currentImageIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent.trim();
        const desc = item.querySelector('.gallery-description').textContent.trim();
        const category = item.querySelector('.gallery-category').textContent.trim();

        const params = new URLSearchParams({
            title: title,
            desc: desc, // Using the short description as content for now
            img: img.src,
            category: category
        });

        window.location.href = `gallery-detail.html?${params.toString()}`;
    });
});

// Clickable Info Cards (Facts & Stats)
document.querySelectorAll('.clickable-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const category = card.getAttribute('data-category');
        const imgSrc = card.getAttribute('data-img');

        // Use the title as the description key as well if no specific desc exists
        const params = new URLSearchParams({
            title: title,
            desc: `Read more about ${title}...`,
            img: imgSrc,
            category: category
        });

        window.location.href = `gallery-detail.html?${params.toString()}`;
    });
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Close lightbox on click outside image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Parallax Effect for Hero
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px"
});

revealElements.forEach(el => {
    revealObserver.observe(el);
    // Immediate check if already visible
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
    }
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formStatus = document.getElementById('formStatus');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = 'Oops! Something went wrong. Please try again later.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
// Video Volume Toggle
const heroVideo = document.getElementById('heroVideo');
const volumeToggle = document.getElementById('volumeToggle');
const volumeIcon = volumeToggle?.querySelector('.volume-icon');

if (heroVideo && volumeToggle) {
    volumeToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        if (volumeIcon) {
            volumeIcon.textContent = heroVideo.muted ? '🔇' : '🔊';
        }
    });

    // Try to play again in case of autoplay issues
    document.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play().catch(err => console.log("Video play error:", err));
        }
    }, { once: true });
}
