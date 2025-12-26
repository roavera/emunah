/**
 * EMUNAH - Sistema de Control de Interfaz (v2.0)
 * Optimizado para: Rendimiento, Accesibilidad y Aislamiento de Componentes.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de módulos
    initNavigation();
    initCarousel();
    initLightbox();
    initMasonryGallery();
    initFormHandling();
    initScrollAnimations();
    
    console.log('Emunah Interface Engine: Initialized ✨');
});

/* ==========================================================================
   1. NAVEGACIÓN Y UI BASE
   ========================================================================== */
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Event Delegation para cerrar menú al clickear enlaces
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Smooth Scroll para anclajes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ==========================================================================
   2. CARRUSEL DE SERVICIOS (Lógica de Traslación Lineal)
   ========================================================================== */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!track || !nextBtn || !prevBtn) return;

    let index = 0;
    const slides = Array.from(track.children);

    const getVisibleSlides = () => {
        if (window.innerWidth > 992) return 3;
        if (window.innerWidth > 576) return 2;
        return 1;
    };

    const updatePosition = () => {
        const slideWidth = track.querySelector('.carousel-slide').clientWidth;
        track.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        track.style.transform = `translateX(${-index * slideWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
        const visible = getVisibleSlides();
        index = (index < slides.length - visible) ? index + 1 : 0;
        updatePosition();
    });

    prevBtn.addEventListener('click', () => {
        const visible = getVisibleSlides();
        index = (index > 0) ? index - 1 : slides.length - visible;
        updatePosition();
    });

    window.addEventListener('resize', () => {
        track.style.transition = "none";
        updatePosition();
    });
}

/* ==========================================================================
   3. SISTEMA DE LIGHTBOX (Controlador Específico para Cursos)
   ========================================================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxLocation');
    const lbType = document.getElementById('lightboxType');
    const lbDesc = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('lightboxClose');

    if (!lightbox) return;

    /**
     * TÉCNICO: Event Delegation filtrado. 
     * Solo responde si el click (o el ascenso por el DOM) encuentra .lightbox-trigger
     */
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (!trigger) return;

        e.preventDefault();
        const { title, type, image, description } = trigger.dataset;

        // Inyección de metadata
        if (lbImg) lbImg.src = image || '';
        if (lbTitle) lbTitle.textContent = title || '';
        if (lbType) lbType.textContent = type || '';
        if (lbDesc) lbDesc.textContent = description || '';

        // Activación de estado
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Inhibición de scroll
    });

    const closeModal = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeModal();
    });
}

/* ==========================================================================
   4. GALERÍA MASONRY (Random Shuffle)
   ========================================================================== */
function initMasonryGallery() {
    const container = document.getElementById('worksMasonry');
    if (!container) return;

    const items = Array.from(container.children);
    const shuffled = items.sort(() => Math.random() - 0.5);

    container.innerHTML = '';
    shuffled.forEach(item => container.appendChild(item));
}

/* ==========================================================================
   5. FORMULARIO DE CONTACTO Y NOTIFICACIONES
   ========================================================================== */
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log('Form payload:', data);
        showNotification('¡Gracias! Nos pondremos en contacto pronto.', 'success');
        e.target.reset();
    });
}

function showNotification(message, type) {
    const note = document.createElement('div');
    note.className = `notification notification-${type}`;
    note.textContent = message;
    
    // Inyección de estilos inline para garantizar visibilidad inmediata
    note.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background-color: ${type === 'success' ? '#4A6741' : '#8B6F47'};
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(note);
    setTimeout(() => {
        note.style.opacity = '0';
        note.style.transform = 'translateX(20px)';
        note.style.transition = 'all 0.3s ease';
        setTimeout(() => note.remove(), 300);
    }, 3500);
}

/* ==========================================================================
   6. ANIMACIONES DE ENTRADA (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    document.querySelectorAll('.about-content, .form-container, .course-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}