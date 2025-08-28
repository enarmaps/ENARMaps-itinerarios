// =================================================================== //
// LIBRERÍA DE LÓGICA PARA MÓDULOS DE MAPA MENTAL (map-logic.js)      //
// =================================================================== //

function renderMarkmap(markdownContent) {
    if (!window.markmap || !markdownContent) {
        console.error("Markmap libraries not loaded or no content provided.");
        return;
    }

    const { Transformer, Markmap } = window.markmap;
    const transformer = new Transformer();
    
    const { root, features } = transformer.transform(markdownContent);

    const options = {
        autoFit: true,
        colorFreezeLevel: 2,
        duration: 500,
        initialExpandLevel: 1, 
        maxWidth: 300,
    };

    Markmap.create('#markmap-svg', options, root);
}

// --- Script Genérico para la Captura de Correos ---
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
        .catch(error => { /* ... (manejo de errores) ... */ });
    });
}

// --- Inicializador ---
// Nota: La llamada a renderMarkmap se hará desde el HTML específico,
// ya que el contenido del mapa (markdownContent) es único para cada módulo.
document.addEventListener('DOMContentLoaded', function () {
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


