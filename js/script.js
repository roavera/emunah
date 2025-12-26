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

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    let index = 0;
    // Función para obtener cuántos slides se ven según el viewport
    const getVisibleSlides = () => {
        if (window.innerWidth > 992) return 3;
        if (window.innerWidth > 576) return 2;
        return 1;
    };

    // Clonación de nodos para buffer infinito
    const visibleSlides = getVisibleSlides();
    for(let i=0; i < visibleSlides; i++) {
        const startClone = slides[i].cloneNode(true);
        const endClone = slides[slides.length - 1 - i].cloneNode(true);
        track.appendChild(startClone);
        track.prepend(endClone);
    }

    const updatePosition = () => {
        const slideWidth = track.querySelector('.carousel-slide').clientWidth;
        track.style.transform = `translateX(${-slideWidth * (index + visibleSlides)}px)`;
    };

    const move = (direction) => {
        const slideWidth = track.querySelector('.carousel-slide').clientWidth;
        track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        
        direction === 'next' ? index++ : index--;
        updatePosition();

        // Control de límites (Salto de fase sin transición)
        track.addEventListener('transitionend', () => {
            if (index >= slides.length) {
                track.style.transition = "none";
                index = 0;
                updatePosition();
            }
            if (index <= -slides.length + (slides.length - 1)) {
                if (index < 0) { // Lógica para retroceso infinito
                    track.style.transition = "none";
                    index = slides.length - 1;
                    updatePosition();
                }
            }
        }, { once: true });
    };

    nextBtn.addEventListener('click', () => move('next'));
    prevBtn.addEventListener('click', () => move('prev'));
    
    // Resize handler para recalcular anchos en cambios de orientación
    window.addEventListener('resize', () => {
        track.style.transition = "none";
        updatePosition();
    });

    // Posicionamiento inicial
    updatePosition();
});

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

/* ==========================================================================
   CONTROLADOR DE CURSOS Y LIGHTBOX (EMUNAH)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Referencias de Nodos del DOM
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxLocation'); // Reutilizado para Título
    const lbType = document.getElementById('lightboxType');
    const lbDesc = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('lightboxClose');

    // 2. Lógica de Apertura (Event Delegation)
    // Escuchamos en el documento para capturar clicks en elementos dinámicos
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        
        if (trigger) {
            // Extracción de metadatos del dataset del botón
            const { title, type, image, description } = trigger.dataset;

            // Inyección de datos en los registros del Lightbox
            if (lbImg) lbImg.src = image || '';
            if (lbTitle) lbTitle.textContent = title || 'Curso Emunah';
            if (lbType) lbType.textContent = type || 'Información General';
            if (lbDesc) lbDesc.textContent = description || '';

            // Cambio de estado de la máquina visual
            openModal();
        }
    });

    // 3. Funciones de Control de Estado (State Management)
    function openModal() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Scroll Lock (Inhibición de desplazamiento)
        
        // Listener para cerrar con tecla Escape (A11y)
        document.addEventListener('keydown', handleEscKey);
    }

    function closeModal() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar flujo del scroll
        document.removeEventListener('keydown', handleEscKey);
    }

    // 4. Handlers de Cierre
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cierre por click en el Backdrop (Overlay)
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeModal();
        });
    }

    // Handler para interrupción por teclado
    function handleEscKey(e) {
        if (e.key === 'Escape') closeModal();
    }
});

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
