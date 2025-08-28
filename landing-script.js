document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // SECCIÓN 1: ANIMACIONES Y EFECTOS VISUALES
    // ======================================================

    // --- EFECTO DE SCROLL EN EL HEADER ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- ANIMACIÓN "FADE-IN-UP" PARA SECCIONES ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // --- SMOOTH SCROLL PARA ANCLAS ---
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

    // ======================================================
    // SECCIÓN 2: LÓGICA DEL FORMULARIO DE REGISTRO
    // ======================================================
    
    // **IMPORTANTE**: Pega aquí la URL de tu webhook de Make.com
    const WEBHOOK_URL = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn'; 

    const mainOfferForm = document.getElementById('main-offer-form');

    if (mainOfferForm) {
        mainOfferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'Procesando...';

            const formData = {
                nombre: form.querySelector('input[name="nombre"]').value,
                email: form.querySelector('input[name="email"]').value,
                whatsapp: form.querySelector('input[name="whatsapp"]').value,
                source: 'Landing Page - Oferta Principal'
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/webapp/boveda.html';
                } else {
                    throw new Error('Error en la respuesta del servidor.');
                }
            })
            .catch(error => {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un problema con tu registro. Por favor, inténtalo de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = 'Obtener Acceso Gratuito';
            });
        });
    }
});

