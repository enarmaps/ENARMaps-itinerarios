document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    const timePerPriority = { high: 1.5, medium: 1.0, low: 0.5 };
    let itineraryData = []; // Los datos ahora estarán vacíos inicialmente
    let userData = {
        nombre: "Aspirante",
        especialidad: "tu especialidad"
    };

    // --- REFERENCIAS AL DOM ---
    const container = document.getElementById('timeline-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');

    // --- FUNCIÓN PRINCIPAL PARA CARGAR DATOS DEL ITINERARIO ---
    async function fetchItineraryData(userId) {
        try {
            // Construimos la ruta al archivo JSON del usuario.
            // Ejemplo: si el enlace es ?id=cliente001, buscará /cliente/data/cliente001.json
            const response = await fetch(`data/${userId}.json`);
            if (!response.ok) {
                throw new Error('No se pudo encontrar el itinerario del usuario.');
            }
            const data = await response.json();
            
            // Guardamos los datos cargados en nuestras variables globales
            itineraryData = data.itinerary;
            userData = data.userData;

            // Una vez cargados los datos, renderizamos todo
            renderHeader();
            renderAllDays();
            updateProgressAndStreak();

        } catch (error) {
            console.error('Error al cargar los datos:', error);
            container.innerHTML = `<div class="error-message">
                <h3>Hubo un problema al cargar tu itinerario</h3>
                <p>Por favor, verifica que tu enlace sea correcto o contacta a soporte si el problema persiste.</p>
            </div>`;
        }
    }

    // --- LÓGICA DE RENDERIZADO (similar al demo, pero usando datos cargados) ---

    function renderHeader() {
        headerTitle.textContent = `Itinerario Estratégico para ${userData.nombre}`;
        headerSubtitle.textContent = `Tu ruta personalizada hacia ${userData.especialidad}`;
    }

    function renderAllDays() {
        container.innerHTML = '';
        const startDate = new Date(itineraryData[0].startDate); // La fecha de inicio ahora viene en el JSON
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        itineraryData.forEach((item, index) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            const dateString = dayDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            const dateISO = dayDate.toISOString().split('T')[0];
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.setAttribute('data-date', dateISO);
            
            // Lógica de clases para hoy/pasado/futuro (sin cambios)
            if (dayDate.getFullYear() === today.getFullYear() && dayDate.getMonth() === today.getMonth() && dayDate.getDate() === today.getDate()) {
                dayCard.classList.add('is-today');
            } else if (dayDate < today) {
                dayCard.classList.add('is-past');
            }
            if(item.type === 'review') dayCard.classList.add('is-special-day');

            // El resto de la lógica de renderizado es la misma que en el demo
            let tasksHtml = '';
            if (item.type === 'review') {
                tasksHtml = `<button class="review-button">Generar Repaso (Función Premium)</button>`;
            } else {
                tasksHtml = `<ul class="tasks-list">${generateTasksHtml(item.tasks, dateISO)}</ul>`;
            }

            const noteId = `note-${dateISO}`;
            const savedNote = localStorage.getItem(noteId) || '';
            const notesHtml = `<div class="notes-section"><label for="${noteId}">Mis Notas del Día:</label><textarea id="${noteId}" placeholder="Anota aquí tus dudas, perlas o datos clave...">${savedNote}</textarea></div>`;

            dayCard.innerHTML = `
                <div class="day-header">
                    <h2>${item.specialty}</h2>
                    <span class="date">${dateString}</span>
                </div>
                ${tasksHtml}
                ${notesHtml}`;
            container.appendChild(dayCard);
        });
    }
    
    // Función para generar el HTML de las tareas (sin cambios)
    function generateTasksHtml(tasks, dateISO) {
        let html = '';
        tasks.forEach((task, taskIndex) => {
            const taskId = `task-${dateISO}-${taskIndex}`;
            const isChecked = localStorage.getItem(taskId) === 'true';
            let topicHtml = `<span class="priority-badge priority-${task.priority}"></span>${task.topic}`;
            const descriptionHtml = task.description ? `<div class="description">${task.description}</div>` : '';
            html += `
                <li class="task-item">
                    <input type="checkbox" id="${taskId}" ${isChecked ? 'checked' : ''}>
                    <div class="task-details">
                        <label for="${taskId}" class="topic">${topicHtml}</label>
                        ${descriptionHtml}
                    </div>
                </li>`;
        });
        return html;
    }

    // Funciones de actualización de progreso y listeners (sin cambios)
    function updateProgressAndStreak() { /* ... igual que en el demo ... */ }
    container.addEventListener('change', (e) => { /* ... igual que en el demo ... */ });
    container.addEventListener('input', (e) => { /* ... igual que en el demo ... */ });


    // --- INICIALIZACIÓN ---
    // 1. Obtenemos el ID del usuario desde la URL (ej: ?id=cliente001)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // 2. Si hay un ID, cargamos sus datos. Si no, mostramos un error.
    if (userId) {
        fetchItineraryData(userId);
    } else {
        container.innerHTML = `<div class="error-message">
            <h3>ID de usuario no encontrado.</h3>
            <p>Asegúrate de que estás utilizando el enlace personalizado que te enviamos por correo.</p>
        </div>`;
    }
});