// =================================================================== //
// LIBRERÍA DE LÓGICA COMÚN PARA MÓDulos FEYNMAN (feynman-logic.js)    //
// =================================================================== //

// --- Función para la Lógica de Preguntas de Múltiple Opción (MCQ) ---
// Esta función es genérica y funcionará para cualquier MCQ en cualquier módulo.
function setupMCQ() {
    const mcqContainers = document.querySelectorAll('.interactive-simulator[id^="q"]');
    mcqContainers.forEach(container => {
        const options = container.querySelectorAll('.mcq-option');
        const explanation = container.querySelector('.explanation');
        if (!options.length) return;

        options.forEach(option => {
            option.addEventListener('click', function() {
                // No deshabilitar opciones, permitir clics múltiples
                if (this.dataset.correct === 'true') {
                    this.classList.add('correct');
                    if (explanation) {
                        explanation.style.display = 'block';
                        explanation.innerHTML = `<p><strong>Explicación: ¡Correcto!</strong> ${this.textContent} puede causar un eje a -60° como desvío inicial. Este módulo explora direcciones; detalles como QRS se cubrirán en un módulo futuro.</p>`;
                    }
                } else {
                    this.classList.add('incorrect');
                    const correctOptions = container.querySelectorAll('[data-correct="true"]');
                    correctOptions.forEach(correct => correct.classList.add('correct'));
                    if (explanation) {
                        explanation.style.display = 'block';
                        explanation.innerHTML = `<p><strong>Explicación:</strong> ${this.textContent} no es la mejor opción inicial. Las correctas son ${Array.from(correctOptions).map(opt => opt.textContent).join(' y ')}. Este módulo se enfoca en ejes.</p>`;
                    }
                }
                // Mantener opciones habilitadas
            });
        });
    });
}

// --- Script Genérico para la Captura de Correos ---
// Este también es genérico y se usa en todos los módulos.
function setupLeadCapture() {
    const leadForm = document.querySelector('.lead-form-interno');
    if (!leadForm) return;

    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const submitButton = this.querySelector('button[type="submit"]');
        const webhookUrl = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn';

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value, source: window.location.pathname })
        })
        .then(response => {
            if (response.ok) {
                this.innerHTML = '<p style="font-size: 1.2rem; color: white; font-weight: 600;">¡Gracias! Estás en la lista.</p>';
            } else { throw new Error('Error en el envío.'); }
        })
        .catch(error => { /* ... manejo de errores ... */ });
    });
}

// --- Inicializador que llama a las funciones ---
document.addEventListener('DOMContentLoaded', function () {
    setupMCQ();
    setupModuleLeadCapture(); // Cambiamos el nombre de la función aquí
});

// --- Script para la Captura de Leads del Módulo ---
function setupModuleLeadCapture() {
    const WEBHOOK_URL = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn';
    const moduleForm = document.querySelector('.lead-form-interno');

    if (moduleForm) { // <-- Esta línea evita errores en otras páginas
        moduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'Procesando...';

            const formData = {
                nombre: form.querySelector('input[name="nombre"]').value,
                email: form.querySelector('input[name="email"]').value,
                whatsapp: form.querySelector('input[name="whatsapp"]').value,
                source: document.title 
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if(response.ok) {
                    window.open('/webapp/boveda.html', '_blank');
                    form.innerHTML = '<p style="font-size: 1.2rem; color: white; font-weight: 600;">¡Éxito! La Bóveda se ha abierto en una nueva pestaña.</p>';
                } else { throw new Error('Error en el webhook.'); }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema. Intenta de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = 'Acceder a la Bóveda Gratuita';
            });
        });
    }
}


