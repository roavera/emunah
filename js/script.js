// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
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

    // Initialize masonry gallery with random shuffle
    initMasonryGallery();

    // Initialize lightbox
    initLightbox();

    // Add scroll animations
    observeElements();
});

// Masonry Gallery - Random Shuffle
function initMasonryGallery() {
    const masonryContainer = document.getElementById('worksMasonry');
    if (!masonryContainer) return;

    // Get all work items
    const workItems = Array.from(masonryContainer.children);

    // Shuffle array randomly
    const shuffled = workItems.sort(() => Math.random() - 0.5);

    // Clear container and append shuffled items
    masonryContainer.innerHTML = '';
    shuffled.forEach(item => masonryContainer.appendChild(item));
}

// Lightbox Functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxType = document.getElementById('lightboxType');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const workItems = document.querySelectorAll('.work-item');

    // Open lightbox on work item click
    workItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const location = item.dataset.location;
            const type = item.dataset.type;
            const description = item.dataset.description;

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxLocation.textContent = `📍 ${location}`;
            lightboxType.textContent = type;
            lightboxDescription.textContent = description;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('Form submitted:', data);

    // Show success message
    showNotification('¡Gracias! Nos pondremos en contacto contigo pronto.', 'success');

    // Reset form
    e.target.reset();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4A6741' : '#8B6F47'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Intersection Observer for scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections
    document.querySelectorAll('.about-content, .form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Emunah website initialized ✨');
