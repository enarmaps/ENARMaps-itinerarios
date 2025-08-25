document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timeline-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    
    let allTasks = [];
    let clientData = {};
    const STORAGE_KEY_PREFIX = 'enarmaps_progress_';

    async function loadClientData(clienteId) {
        // La ruta es relativa a la carpeta 'webapp' donde está el itinerario.html
        const dataPath = `../cliente/data/${clienteId}.json`;
        try {
            const response = await fetch(dataPath);
            if (!response.ok) throw new Error('File not found');
            clientData = await response.json();
            renderPage();
        } catch (error) {
            console.error('Error loading client data:', error);
            container.innerHTML = `<h2>Error al Cargar</h2><p>No se pudo encontrar tu itinerario. Verifica la consola (F12) para más detalles.</p>`;
        }
    }

    function renderPage() {
        if (clientData.clienteInfo) {
            headerTitle.textContent = `Itinerario Estratégico para ${clientData.clienteInfo.nombre}`;
            headerSubtitle.textContent = `Tu ruta personalizada hacia ${clientData.clienteInfo.especialidadDeseada}`;
        }
        renderTimeline();
    }

    function renderTimeline() {
        container.innerHTML = '';
        allTasks = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        clientData.itinerarioDetallado.forEach(dia => {
            const dayCard = document.createElement('div');
            // Aseguramos que la fecha se interprete correctamente como local
            const dayDate = new Date(dia.fecha + 'T00:00:00');
            dayCard.className = 'day-card';
            if (dayDate.getTime() === today.getTime()) {
                dayCard.classList.add('is-today');
            } else if (dayDate < today) {
                dayCard.classList.add('is-past');
            }
             if (dia.especialidadDelDia.toLowerCase().includes('repaso')) {
                dayCard.classList.add('is-special-day');
            }

            // LÓGICA UNIFICADA: Siempre esperamos una lista de tareas.
            let contentHtml = '<ul class="tasks-list">';
            if (dia.tareas && dia.tareas.length > 0) {
                dia.tareas.forEach((tarea, index) => {
                    const taskId = `task-${dia.fecha}-${index}`;
                    allTasks.push({ id: taskId, topic: tarea.tema, date: dia.fecha });
                    const isChecked = localStorage.getItem(STORAGE_KEY_PREFIX + taskId) === 'true';
                    contentHtml += `
                        <li class="task-item">
                            <input type="checkbox" id="${taskId}" ${isChecked ? 'checked' : ''}>
                            <label for="${taskId}" class="task-details">
                                <span class="topic">
                                    <span class="priority-badge priority-${tarea.prioridad.toLowerCase()}"></span>
                                    ${tarea.tema}
                                </span>
                                <div class="description">${tarea.accionSugerida}</div>
                            </label>
                        </li>`;
                });
            } else {
                contentHtml += `<p style="text-align:center; padding: 20px;">Día de estudio libre o simulacro programado.</p>`;
            }
            contentHtml += '</ul>';
            
            const noteId = `note-${dia.fecha}`;
            const savedNote = localStorage.getItem(STORAGE_KEY_PREFIX + noteId) || '';
            const notesHtml = `<div class="notes-section"><label for="${noteId}">Mis Notas del Día:</label><textarea id="${noteId}" placeholder="Anota aquí tus dudas, perlas o datos clave...">${savedNote}</textarea></div>`;
            
            dayCard.innerHTML = `
                <div class="day-header">
                    <h2>${dia.especialidadDelDia}</h2>
                    <span class="date">${dayDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                ${contentHtml}
                ${notesHtml}`;
            container.appendChild(dayCard);
        });
        
        const todayCard = document.querySelector('.is-today');
        if (todayCard) {
            todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Listener de eventos SIMPLIFICADO
    container.addEventListener('click', function(event) {
        if (event.target.matches('input[type="checkbox"]')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + event.target.id, event.target.checked);
        }
    });

    container.addEventListener('input', (e) => {
        if (e.target.matches('.notes-section textarea')) {
            localStorage.setItem(STORAGE_KEY_PREFIX + e.target.id, e.target.value);
        }
    });

    // --- INICIALIZACIÓN ---
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');
    if (clienteId) {
        loadClientData(clienteId);
    } else {
        headerTitle.textContent = "Error: Falta ID de Cliente";
        container.innerHTML = `<div class="day-card"><p style="text-align:center;">Asegúrate de que la URL contenga tu ID de cliente. Ejemplo: .../itinerario.html?id=enarmaps-ID</p></div>`;
    }
});
