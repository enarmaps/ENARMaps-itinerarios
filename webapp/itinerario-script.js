document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timeline-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');

    // Constantes para el cálculo de tiempo
    const timePerPriority = { 'Alta': 1.5, 'Media': 1.0, 'Baja': 0.5 };

    /**
     * Obtiene las horas disponibles del usuario para un día específico de la semana.
     * @param {number} dayOfWeek - El día de la semana (0 para Domingo, 6 para Sábado).
     * @returns {number} Las horas disponibles.
     */
    function getAvailableHoursForDay(dayOfWeek) {
        if (dayOfWeek === 6) return parseFloat(document.getElementById('sim-horas-sabado').value) || 0;
        if (dayOfWeek === 0) return parseFloat(document.getElementById('sim-horas-domingo').value) || 0;
        return parseFloat(document.getElementById('sim-horas-lv').value) || 0;
    }

    /**
     * Crea el HTML para las barras de gestión del tiempo.
     * @param {number} recommended - El total de horas recomendadas.
     * @param {number} available - El total de horas disponibles.
     * @returns {string} El HTML de la sección de tiempo.
     */
    function createTimeManagementHtml(recommended, available) {
        if (recommended === 0) return '';
        const availablePercentage = recommended > 0 ? Math.min((available / recommended) * 100, 100) : 100;
        let suggestionHtml = '';
        if (available < recommended) {
            suggestionHtml = `<div class="time-suggestion">Tu tiempo es limitado. ¡Enfócate en las tareas de prioridad alta!</div>`;
        }
        return `
            <div class="time-management">
                <div class="time-bar-wrapper">
                    <span class="time-label">Tiempo Recomendado: ${recommended.toFixed(1)}h</span>
                    <div class="time-bar recommended-bar"><div style="width: 100%;"></div></div>
                </div>
                <div class="time-bar-wrapper">
                    <span class="time-label">Tu Tiempo Disponible: ${available.toFixed(1)}h</span>
                    <div class="time-bar available-bar"><div style="width: ${availablePercentage}%;"></div></div>
                </div>
                ${suggestionHtml}
            </div>`;
    }

    let allTasks = [];
    let clientData = {};
    const STORAGE_KEY_PREFIX = 'enarmaps_progress_';

    /**
     * Carga los datos del itinerario del cliente desde su archivo JSON.
     * @param {string} clienteId - El ID del cliente.
     */
    async function loadClientData(clienteId) {
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

    /**
     * Renderiza la información general de la página.
     */
    function renderPage() {
        if (clientData.clienteInfo) {
            headerTitle.textContent = `Itinerario Estratégico para ${clientData.clienteInfo.nombre}`;
            headerSubtitle.textContent = `Tu ruta personalizada hacia ${clientData.clienteInfo.especialidadDeseada}`;
        }
        renderTimeline();
    }

    /**
     * Dibuja el itinerario completo en el contenedor principal.
     */
    function renderTimeline() {
        container.innerHTML = '';
        allTasks = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        clientData.itinerarioDetallado.forEach(dia => {
            const dayCard = document.createElement('div');
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

            // Cálculo del tiempo recomendado
            let recommendedTime = 0;
            if (dia.tareas && dia.tareas.length > 0) {
                dia.tareas.forEach(tarea => {
                    recommendedTime += timePerPriority[tarea.prioridad] || 0;
                });
            } else if (dia.especialidadDelDia.toLowerCase().includes('repaso')) {
                recommendedTime = 4; // Tiempo por defecto para repasos
            }
            const availableHours = getAvailableHoursForDay(dayDate.getDay());
            const timeManagementHtml = createTimeManagementHtml(recommendedTime, availableHours);

            // Generación de la lista de tareas
            let contentHtml = '<ul class="tasks-list">';
            if (dia.tareas && dia.tareas.length > 0) {
                dia.tareas.forEach((tarea, index) => {
                    const taskId = `task-${dia.fecha}-${index}`;
                    allTasks.push({ id: taskId, topic: tarea.tema, date: dia.fecha });
                    const isChecked = localStorage.getItem(STORAGE_KEY_PREFIX + taskId) === 'true';
                    
                    const priorityMap = { 'Alta': 'high', 'Media': 'medium', 'Baja': 'low' };
                    const priorityClass = priorityMap[tarea.prioridad] || 'medium';

                    contentHtml += `
                        <li class="task-item">
                            <input type="checkbox" id="${taskId}" ${isChecked ? 'checked' : ''}>
                            <label for="${taskId}" class="task-details">
                                <span class="topic">
                                    <span class="priority-badge priority-${priorityClass}"></span>
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
            
            // Sección de notas
            const noteId = `note-${dia.fecha}`;
            const savedNote = localStorage.getItem(STORAGE_KEY_PREFIX + noteId) || '';
            const notesHtml = `<div class="notes-section"><label for="${noteId}">Mis Notas del Día:</label><textarea id="${noteId}" placeholder="Anota aquí tus dudas, perlas o datos clave...">${savedNote}</textarea></div>`;
            
            // Ensamblaje final de la tarjeta del día
            dayCard.innerHTML = `
                <div class="day-header">
                    <h2>${dia.especialidadDelDia}</h2>
                    <span class="date">${dayDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                ${timeManagementHtml}
                ${contentHtml}
                ${notesHtml}`;
            container.appendChild(dayCard);
        });
        
        const todayCard = document.querySelector('.is-today');
        if (todayCard) {
            todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // --- EVENT LISTENERS ---

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
    
    const hoursForm = document.getElementById('hours-simulation-form');
    if (hoursForm) {
        hoursForm.addEventListener('input', renderTimeline);
    }

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
