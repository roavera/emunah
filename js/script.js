/**
 * EMUNAH - Sistema de Control de Interfaz (v3.0)
 * Optimizado para: Rendimiento, Accesibilidad, SEO y UX
 */

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicialización controlada de módulos
        initNavigation();
        initCarousel();
        initLightbox();
        initMasonryGallery();
        initFormHandling();
        initScrollAnimations();
        initPerformanceMonitoring();
        
        console.log('🌱 Emunah Interface Engine: Initialized successfully');
    } catch (error) {
        console.error('🚨 Emunah Interface Engine: Initialization failed', error);
        // Fallback básico para funcionalidades críticas
        initNavigationFallback();
    }
});

/* ==========================================================================
   1. NAVEGACIÓN Y UI BASE (MEJORADO)
   ========================================================================== */
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuToggle || !navMenu) return;

    // Estado del menú
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
        
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Enfocar el primer enlace del menú para accesibilidad
        if (isMenuOpen) {
            setTimeout(() => {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 100);
        }
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
            mobileMenuToggle.focus();
        }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // Smooth Scroll mejorado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Cerrar menú móvil si está abierto
                if (isMenuOpen) toggleMenu();
                
                // Scroll suave con offset para navbar fija
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - navbarHeight - 20,
                    behavior: 'smooth'
                });
                
                // Enfocar el elemento destino para accesibilidad
                setTimeout(() => {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.removeAttribute('tabindex');
                }, 500);
            }
        });
    });
}

/* ==========================================================================
   2. CARRUSEL DE SERVICIOS (OPTIMIZADO)
   ========================================================================== */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!track || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    let isAnimating = false;
    const slides = Array.from(track.children);
    
    // Crear indicadores de posición
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    indicatorsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 1rem;
    `;
    
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('aria-label', `Ir a slide ${index + 1}`);
        indicator.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${index === 0 ? 'var(--color-primary)' : '#ccc'};
            border: none;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        
        indicator.addEventListener('click', () => {
            if (!isAnimating) goToSlide(index);
        });
        
        indicatorsContainer.appendChild(indicator);
    });
    
    track.parentElement.appendChild(indicatorsContainer);
    const indicators = document.querySelectorAll('.carousel-indicator');

    const updateIndicators = () => {
        indicators.forEach((indicator, index) => {
            indicator.style.background = index === currentIndex ? 'var(--color-primary)' : '#ccc';
        });
    };

    const getVisibleSlides = () => {
        if (window.innerWidth > 992) return 3;
        if (window.innerWidth > 576) return 2;
        return 1;
    };

    const goToSlide = (index) => {
        if (isAnimating) return;
        
        isAnimating = true;
        const visible = getVisibleSlides();
        const totalSlides = slides.length;
        
        // Ajustar índice para loop infinito
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - visible;
        
        currentIndex = index;
        const slideWidth = track.querySelector('.carousel-slide').clientWidth;
        
        track.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        updateIndicators();
        
        // Actualizar atributos ARIA
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== currentIndex);
        });
        
        // Resetear animación
        setTimeout(() => {
            isAnimating = false;
            if (currentIndex >= totalSlides - visible + 1) {
                track.style.transition = "none";
                currentIndex = 0;
                track.style.transform = `translateX(0)`;
                setTimeout(() => {
                    track.style.transition = "";
                }, 50);
            }
        }, 600);
    };

    nextBtn.addEventListener('click', () => {
        if (!isAnimating) goToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
        if (!isAnimating) goToSlide(currentIndex - 1);
    });

    // Navegación por teclado
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

    // Auto-play opcional (descomentar si se necesita)
    // let autoPlayInterval = setInterval(() => nextBtn.click(), 5000);
    
    // Pausar auto-play al hacer hover
    // track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    // track.addEventListener('mouseleave', () => {
    //     autoPlayInterval = setInterval(() => nextBtn.click(), 5000);
    // });

    // Responsive con debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            track.style.transition = "none";
            goToSlide(currentIndex);
        }, 250);
    });
    
    // Inicializar atributos ARIA
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-hidden', index !== 0);
        slide.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
}

/* ==========================================================================
   3. SISTEMA DE LIGHTBOX (MEJORADO)
   ========================================================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImage');
    const lbTitle = document.getElementById('lightboxLocation');
    const lbType = document.getElementById('lightboxType');
    const lbDesc = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('lightboxClose');

    if (!lightbox) return;

    // Pre-cargar imágenes de cursos para mejor UX
    const preloadCourseImages = () => {
        const courseImages = document.querySelectorAll('.lightbox-trigger[data-image]');
        courseImages.forEach(trigger => {
            const img = new Image();
            img.src = trigger.dataset.image;
        });
    };
    
    setTimeout(preloadCourseImages, 1000); // Pre-cargar después de 1s

    const openLightbox = (data) => {
        if (lbImg) {
            // Mostrar loader mientras carga
            lbImg.style.opacity = '0.5';
            const img = new Image();
            img.src = data.image || '';
            img.onload = () => {
                lbImg.src = data.image;
                lbImg.style.opacity = '1';
            };
            img.onerror = () => {
                lbImg.src = 'media/images/placeholder.jpg';
                lbImg.style.opacity = '1';
            };
        }
        
        if (lbTitle) lbTitle.textContent = data.title || '';
        if (lbType) lbType.textContent = data.type || '';
        if (lbDesc) lbDesc.textContent = data.description || '';

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
        
        // Bloquear scroll táctil
        lightbox.style.touchAction = 'none';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightbox.style.touchAction = '';
        
        // Devolver foco al elemento que abrió el lightbox
        if (lightbox.lastTrigger) {
            setTimeout(() => lightbox.lastTrigger.focus(), 100);
        }
    };

    // Event delegation con mejor performance
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (!trigger) return;

        e.preventDefault();
        lightbox.lastTrigger = trigger;
        openLightbox(trigger.dataset);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        
        // Navegación por teclado dentro del lightbox
        if (lightbox.classList.contains('active') && e.key === 'Tab') {
            const focusableElements = lightbox.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

/* ==========================================================================
   4. GALERÍA MASONRY (CON LOADING LAZY)
   ========================================================================== */
function initMasonryGallery() {
    const container = document.getElementById('worksMasonry');
    if (!container) return;

    // Shuffle aleatorio con algoritmo Fisher-Yates
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const items = Array.from(container.children);
    const shuffledItems = shuffleArray([...items]);
    
    // Aplicar lazy loading a imágenes
    shuffledItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.loading = 'lazy';
            img.decoding = 'async';
        }
    });
    
    // Reemplazar contenido con animación
    container.innerHTML = '';
    shuffledItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        container.appendChild(item);
        
        // Animar entrada
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });

    // Inicializar Intersection Observer para lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    container.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ==========================================================================
   5. FORMULARIO DE CONTACTO (CON VALIDACIÓN)
   ========================================================================== */
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = isValid ? '' : 'Por favor ingresa un email válido';
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
                isValid = phoneRegex.test(value);
                errorMessage = isValid ? '' : 'Por favor ingresa un teléfono válido';
                break;
            default:
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Este campo es obligatorio';
                }
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError({ target: field });
        }

        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError({ target: field });
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #D64545;
            font-size: 0.8rem;
            margin-top: 4px;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#D64545';
    }

    function clearFieldError(e) {
        const field = e.target;
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
        field.style.borderColor = '';
    }

    // Envío del formulario
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar todos los campos
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
        submitBtn.style.opacity = '0.7';
        
        try {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Simulación de envío (reemplazar con fetch real)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('📧 Form data:', data);
            
            // Mostrar notificación de éxito
            showNotification('¡Gracias por tu consulta! Te responderemos en menos de 24 horas.', 'success');
            
            // Resetear formulario
            contactForm.reset();
            
            // Enviar evento a Google Analytics (si está configurado)
            if (typeof gtag === 'function') {
                gtag('event', 'contact_form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Form Submission'
                });
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Hubo un error al enviar el formulario. Por favor intenta nuevamente.', 'error');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    });
}

/* ==========================================================================
   6. ANIMACIONES DE ENTRADA (OPTIMIZADO)
   ========================================================================== */
function initScrollAnimations() {
    // Configurar Intersection Observer con opciones optimizadas
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '-50px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    // Observar elementos estratégicos
    const elementsToAnimate = document.querySelectorAll(
        '.about-content, .services-content, .form-container, .course-card, .service-item'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Añadir clase CSS para animación
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================================================
   7. MONITOREO DE PERFORMANCE
   ========================================================================== */
function initPerformanceMonitoring() {
    // Medir tiempo de carga
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log(`⏱️ Tiempo de carga total: ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️  El sitio está tardando en cargar. Considera optimizar imágenes y recursos.');
    }
    
    // Monitorizar errores de recursos
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.error(`❌ Error cargando imagen: ${e.target.src}`);
            e.target.src = 'media/images/placeholder.jpg';
        }
    }, true);
    
    // Medir Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`🎯 LCP: ${lastEntry.startTime}ms`, lastEntry.element);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
}

/* ==========================================================================
   8. FALLBACKS Y COMPATIBILIDAD
   ========================================================================== */
function initNavigationFallback() {
    // Fallback básico para navegación si el JS principal falla
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView();
            }
        });
    });
}

/* ==========================================================================
   9. UTILIDADES DE NOTIFICACIÓN (REUTILIZABLE)
   ========================================================================== */
function showNotification(message, type = 'info') {
    // Evitar duplicados
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;
    
    // Estilos
    const typeStyles = {
        success: { bg: '#4A6741', icon: '✅' },
        error: { bg: '#D64545', icon: '❌' },
        info: { bg: '#2c3e50', icon: 'ℹ️' }
    };
    
    const style = typeStyles[type] || typeStyles.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${style.bg};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-body, sans-serif);
        font-size: 0.95rem;
        line-height: 1.4;
        border-left: 4px solid rgba(255,255,255,0.3);
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.2em;">${style.icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.9)';
        notification.style.transition = 'all 0.4s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 5000);
    
    // Permitir cerrar manualmente
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });
}

/* ==========================================================================
   10. POLYFILLS Y COMPATIBILIDAD (opcional)
   ========================================================================== */
// Añadir polyfills si es necesario para navegadores antiguos
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

// Polyfill para forEach en NodeList para IE
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Exportar funciones principales para uso externo si es necesario
window.EmunahApp = {
    showNotification,
    closeLightbox: () => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) lightbox.classList.remove('active');
    }
};