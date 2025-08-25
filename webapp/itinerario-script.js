document.addEventListener('DOMContentLoaded', () => {
    // =================================================================== //
    // CONFIGURACIÓN Y REFERENCIAS AL DOM                                  //
    // =================================================================== //
    const container = document.getElementById('timeline-container');
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    const progressBar = document.getElementById('general-progress-bar');

    let allTasks = []; // Almacenará todas las tareas del itinerario para la lógica de progreso y repaso

    // =================================================================== //
    // FUNCIÓN PRINCIPAL PARA CARGAR Y PROCESAR LOS DATOS DEL CLIENTE      //
    // =================================================================== //
    async function cargarItinerarioCompleto(clienteId) {
        // Ruta corregida: Sube un nivel desde 'webapp' para encontrar 'cliente/data/'
        const dataPath = `../cliente/data/${clienteId}.json`;
        try {
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error('No se pudo encontrar el archivo de itinerario del cliente.');
            }
            const data = await response.json();
            
            // Una vez cargados los datos, renderizamos toda la página
            renderPagina(data);

        } catch (error) {
            console.error('Error al cargar los datos:', error);
            container.innerHTML = `<div style="text-align:center; padding: 40px;"><h2>Error al Cargar el Itinerario</h2><p>No pudimos encontrar tu plan de estudio. Por favor, verifica que tu enlace sea correcto o contacta a soporte.</p></div>`;
        }
    }

    // =================================================================== //
    // FUNCIONES DE RENDERIZADO (CONSTRUCCIÓN DE LA PÁGINA)              //
    // =================================================================== //
    function renderPagina(data) {
        // Renderizar el encabezado con la información del cliente
        if (data.clienteInfo) {
            headerTitle.textContent = `Itinerario Estratégico para ${data.clienteInfo.nombre}`;
            headerSubtitle.textContent = `Tu ruta personalizada hacia ${data.clienteInfo.especialidadDeseada}`;
        }

        container.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevo contenido
        if (data.itinerarioDetallado) {
            allTasks = []; // Resetear la lista de tareas global

            // Crear una tarjeta para cada día en el itinerario
            data.itinerarioDetallado.forEach(dia => {
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                if (dia.especialidadDelDia.toLowerCase().includes('repaso')) {
                    dayCard.classList.add('is-special-day');
                }

                let contentHtml = '';
                // Si es un día de repaso, mostrar el botón especial
                if (dia.especialidadDelDia.toLowerCase().includes('repaso')) {
                    contentHtml = `<button class="review-button" data-date="${dia.fecha}">Generar Repaso Inteligente de la Semana</button>`;
                } else {
                    // Si es un día de estudio normal, mostrar la lista de tareas
                    contentHtml = '<ul class="tasks-list">';
                    dia.tareas.forEach((tarea, index) => {
                        const taskId = `task-${dia.fecha}-${index}`;
                        allTasks.push({ id: taskId, topic: tarea.tema, date: dia.fecha }); // Almacenar tarea para el repaso
                        const isChecked = localStorage.getItem(taskId) === 'true';
                        
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

                // Ensamblar la tarjeta del día completa
                dayCard.innerHTML = `
                    <div class="day-header">
                        <h2>${dia.especialidadDelDia}</h2>
                        <span class="date">${new Date(dia.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    ${contentHtml}
                `;
                container.appendChild(dayCard);
            });
        }
        actualizarProgreso(); // Actualizar la barra de progreso al cargar
    }
    
    // Función para calcular y mostrar el progreso general
    function actualizarProgreso() {
        if (!progressBar || allTasks.length === 0) return;
        
        const completedTasks = allTasks.filter(task => localStorage.getItem(task.id) === 'true').length;
        const percentage = Math.round((completedTasks / allTasks.length) * 100);
        progressBar.style.width = `${percentage}%`;
    }

    // =================================================================== //
    // LÓGICA DE EVENTOS E INTERACTIVIDAD                                  //
    // =================================================================== //
    container.addEventListener('click', function(event) {
        // Lógica para el botón de "Repaso Inteligente"
        if (event.target.classList.contains('review-button')) {
            const button = event.target;
            const reviewDate = new Date(button.dataset.date + 'T00:00:00');
            const oneWeekAgo = new Date(reviewDate);
            oneWeekAgo.setDate(reviewDate.getDate() - 6);

            // Filtrar tareas de la última semana que no fueron completadas
            const tasksToReview = allTasks.filter(task => {
                const taskDate = new Date(task.date + 'T00:00:00');
                return taskDate >= oneWeekAgo && taskDate < reviewDate && localStorage.getItem(task.id) !== 'true';
            });
            
            let reviewHtml = '<ul class="tasks-list">';
            if (tasksToReview.length > 0) {
                reviewHtml += `<p style="margin-bottom:15px; font-weight:600; text-align:center;">Estos son los temas de la semana que quedaron pendientes. ¡Vamos a reforzarlos!</p>`;
                tasksToReview.forEach(task => {
                    reviewHtml += `
                        <li class="task-item" style="padding-left:15px;">
                            <span class="priority-badge priority-high"></span>
                            <div class="task-details">
                                <span class="topic">${task.topic}</span>
                            </div>
                        </li>`;
                });
            } else {
                reviewHtml += `<p style="text-align:center; font-weight:600; color:var(--color-accent-green);">¡Excelente! Has completado todos los temas de la semana. Puedes usar este día para un repaso libre o para descansar.</p>`;
            }
            reviewHtml += '</ul>';
            
            // Insertar la lista de repaso y ocultar el botón
            const dayCardBody = button.parentElement;
            dayCardBody.innerHTML += reviewHtml;
            button.style.display = 'none'; 
        }

        // Lógica para guardar el estado de los checkboxes
        if (event.target.matches('input[type="checkbox"]')) {
            localStorage.setItem(event.target.id, event.target.checked);
            actualizarProgreso();
        }
    });

    // =================================================================== //
    // INICIALIZACIÓN DEL SCRIPT                                           //
    // =================================================================== //
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (clienteId) {
        cargarItinerarioCompleto(clienteId);
    } else {
        headerTitle.textContent = "Error: Falta ID de Cliente";
        headerSubtitle.textContent = "Por favor, accede a través de tu dashboard.";
    }
});
