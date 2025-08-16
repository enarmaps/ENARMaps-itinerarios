// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
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

// Observe elements for animation
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission (placeholder)
document.querySelector('.lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    // --- ¡IMPORTANTE! Pega aquí la URL de tu nuevo webhook ---
    const webhookUrl = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn ';

    if (!emailInput.value) {
        alert('Por favor, ingresa un correo electrónico.');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput.value })
    })
    .then(response => {
        if (response.ok) {
           form.innerHTML = `
                <div class="form-success-message">
                    <div class="success-icon">✓</div>
                    <h3>¡Revisa tu correo!</h3>
                    <p>Te hemos enviado un enlace de confirmación para acceder al demo.</p>
                </div>
            `;
        } else {
            throw new Error('Error en la respuesta del servidor.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitButton.disabled = false;
        submitButton.textContent = 'Obtener Demo Gratis';
        alert('Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo.');
    });
});