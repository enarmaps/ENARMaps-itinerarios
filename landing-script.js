document.addEventListener('DOMContentLoaded', () => {
    
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

    // --- LÓGICA DE FORMULARIO DE CAPTURA PRINCIPAL ---

    // **IMPORTANTE**: Pega aquí la URL de tu webhook de Make.com
    const WEBHOOK_URL = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn'; 

    const mainOfferForm = document.getElementById('main-offer-form');

    if (mainOfferForm) {
        mainOfferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');

            // Deshabilitar botón para evitar envíos múltiples
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // Asumimos éxito y redirigimos inmediatamente para la mejor UX
                window.location.href = 'webapp/boveda.html';
            })
            .catch(error => {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un problema con tu registro. Por favor, inténtalo de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = 'Obtener Acceso Gratuito';
            });
        });
    }

    // --- SMOOTH SCROLL PARA ANCLAS (OPCIONAL PERO RECOMENDADO) ---
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
});
