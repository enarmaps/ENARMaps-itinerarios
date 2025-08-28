// =================================================================== //
// LIBRERÍA DE LÓGICA PARA MÓDULOS STORYTELLING (storytelling-logic.js) //
// =================================================================== //

// --- Función para revelar escenas de la historia de forma secuencial ---
function setupSceneReveal() {
    // Hacemos la función global para que pueda ser llamada desde el onclick del HTML
    window.revealScene = function(sceneId) {
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.style.display = 'block';
            setTimeout(() => {
                scene.style.opacity = '1';
                scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 10);
        }
    }
}

// --- Función para la lógica de Drag and Drop ---
function setupDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const dragOptionsContainer = document.getElementById('drag-options');
    const resetButton = document.getElementById('reset-drag-button');
    if (!dragItems.length || !dropZones.length) return;

    let draggedItem = null;

    dragItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedItem = e.target;
            setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
        });
        item.addEventListener('dragend', function(e) {
            setTimeout(() => { if (e.target) e.target.style.opacity = '1'; draggedItem = null; }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('dragenter', e => { e.preventDefault(); zone.style.backgroundColor = '#e8f5e9'; });
        zone.addEventListener('dragleave', () => { zone.style.backgroundColor = 'transparent'; });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'transparent';
            if (draggedItem && this.dataset.target === draggedItem.dataset.target && !this.querySelector('.drag-item')) {
                this.appendChild(draggedItem);
                draggedItem.style.backgroundColor = 'var(--color-correct, #2e7d32)';
                draggedItem.setAttribute('draggable', 'false');
            } else if (draggedItem) {
                draggedItem.style.backgroundColor = 'var(--color-incorrect, #c62828)';
                setTimeout(() => { draggedItem.style.backgroundColor = 'var(--color-primary-dark, #0D1B4E)'; }, 500);
            }
        });
    });
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            dragItems.forEach(item => {
                if (dragOptionsContainer) dragOptionsContainer.appendChild(item);
                item.style.backgroundColor = 'var(--color-primary-dark, #0D1B4E)';
                item.setAttribute('draggable', 'true');
            });
        });
    }
}


// --- Script Genérico para la Captura de Correos (Reutilizado) ---
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

// --- Inicializador que se ejecuta cuando la página carga ---
document.addEventListener('DOMContentLoaded', function () {
    setupSceneReveal();
    setupDragAndDrop();
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

