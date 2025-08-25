document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timeline-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    
    let allTasks = [];
    let clientData = {};
    const STORAGE_KEY_PREFIX = 'enarmaps_progress_';

    async function loadClientData(clienteId) {
        const dataPath = `../cliente/data/${clienteId}.json`;
        try {
            const response = await fetch(dataPath);
            if (!response.ok) throw new Error('File not found');
            clientData = await response.json();
            renderPage();
        } catch (error) {
            console.error('Error loading client data:', error);
            container.innerHTML = `<h2>Error al Cargar</h2><p>No se pudo encontrar tu itinerario.</p>`;
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

            let contentHtml = '';
            if (dia.especialidadDelDia.toLowerCase().includes('repaso')) {
                contentHtml = `<button class="review-button" data-date="${dia.fecha}">Generar Repaso Inteligente</button>`;
            } else {
                contentHtml = '<ul class="tasks-list">';
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
                contentHtml += '</ul>';
            }
            
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
        
        // Enfocar la vista en el día de hoy
        const todayCard = document.querySelector('.is-today');
        if (todayCard) {
            todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    container.addEventListener('click', function(event) {
        if (event.target.classList.contains('review-button')) {
            const button = event.target;
            const reviewDate = new Date(button.dataset.date + 'T00:00:00');
            const oneWeekAgo = new Date(reviewDate);
            oneWeekAgo.setDate(reviewDate.getDate() - 6);

            const tasksToReview = allTasks.filter(task => {
                const taskDate = new Date(task.date + 'T00:00:00');
                return taskDate >= oneWeekAgo && taskDate < reviewDate && localStorage.getItem(STORAGE_KEY_PREFIX + task.id) !== 'true';
            });
            
            let reviewHtml = '<ul class="tasks-list">';
            if (tasksToReview.length > 0) {
                reviewHtml += `<p style="margin-bottom:15px; font-weight:600;">Temas pendientes de la semana para reforzar:</p>`;
                tasksToReview.forEach(task => {
                    reviewHtml += `<li class="task-item" style="padding-left:15px;"><span class="priority-badge priority-high"></span><div class="task-details"><span class="topic">${task.topic}</span></div></li>`;
                });
            } else {
                reviewHtml += `<p style="text-align:center; font-weight:600; color:var(--color-accent-green);">¡Felicidades! Completaste todos los temas de la semana.</p>`;
            }
            reviewHtml += '</ul>';
            
            button.insertAdjacentHTML('afterend', reviewHtml);
            button.style.display = 'none';
        }

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
    }
});
