document.addEventListener('DOMContentLoaded', () => {
    const timePerPriority = { high: 1.5, medium: 1.0, low: 0.5 };
    const itineraryData = [
        { day: 0, type: 'study', specialty: 'Ginecología y Obstetricia', tasks: [ { priority: 'high', topic: 'Enfermedad Hipertensiva del Embarazo', description: 'Ver videoclase y leer GPC.' }, { priority: 'medium', topic: 'Hemorragia Obstétrica', description: 'Hacer banco de preguntas.' }, { priority: 'low', topic: 'Vaginosis Bacteriana', description: 'Repaso rápido con flashcards.'} ] },
        { day: 1, type: 'study', specialty: 'Cirugía General', tasks: [ { priority: 'high', topic: 'Apendicitis Aguda', description: 'Leer GPC y hacer banco de preguntas.' }, { priority: 'medium', topic: 'Patología Biliar', description: 'Ver videoclase.' }, { priority: 'low', topic: 'Hernia Inguinal', description: 'Repaso rápido con flashcards.'} ] },
        { day: 2, type: 'study', specialty: 'Medicina Interna', tasks: [ { priority: 'high', topic: 'Diabetes Mellitus 2', description: 'Leer GPC y hacer banco de preguntas.'}, { priority: 'medium', topic: 'EPOC', description: 'Repaso con videoclase.'}, { priority: 'low', topic: 'Gota', description: 'Lectura rápida.'} ] },
        { day: 3, type: 'study', specialty: 'Pediatría', tasks: [ { priority: 'high', topic: 'Reanimación Neonatal', description: 'Leer GPC y hacer banco de preguntas.' }, { priority: 'medium', topic: 'Esquema de Vacunación', description: 'Hacer flashcards y repasar diario.'}, { priority: 'low', topic: 'Dermatitis del pañal', description: 'Lectura rápida.'} ] },
        { day: 4, type: 'study', specialty: 'Urgencias y Especialidades', tasks: [ { priority: 'high', topic: 'Manejo del Politraumatizado (ATLS)', description: 'Ver videoclase y hacer flashcards del ABCDE.'}, { priority: 'medium', topic: 'EVC', description: 'Hacer banco de preguntas.'}, { priority: 'low', topic: 'Cefaleas primarias', description: 'Lectura rápida.'} ] },
        { day: 5, type: 'study', specialty: 'Medicina Interna (Refuerzo)', tasks: [ { priority: 'high', topic: 'Cardiopatía Isquémica (SICA)', description: 'Ver videoclase y hacer flashcards.' }, { priority: 'medium', topic: 'Insuficiencia Cardiaca', description: 'Hacer banco de preguntas.'}, { priority: 'low', topic: 'Fibrilación Auricular', description: 'Lectura rápida.'} ] },
        { day: 6, type: 'review', specialty: 'Repaso Inteligente y Simulacro' },
        { day: 7, type: 'study', specialty: 'Ginecología y Obstetricia', tasks: [ { priority: 'high', topic: 'Control Prenatal', description: 'Leer NOM-007 y hacer preguntas.'}, { priority: 'medium', topic: 'Cáncer Cervicouterino', description: 'Repasar NOM-014 y videoclase.'}, { priority: 'low', topic: 'Miomatosis Uterina', description: 'Repaso con flashcards.'} ] },
        { day: 8, type: 'study', specialty: 'Cirugía General', tasks: [ { priority: 'high', topic: 'TCE y Escala de Glasgow', description: 'Hacer banco de preguntas.'}, { priority: 'medium', topic: 'Manejo de Quemaduras', description: 'Ver videoclase (Fórmula de Parkland).'}, { priority: 'low', topic: 'Enfermedad diverticular', description: 'Lectura rápida.'} ] },
        { day: 9, type: 'study', specialty: 'Medicina Interna', tasks: [ { priority: 'high', topic: 'Tuberculosis', description: 'Leer NOM-006 y hacer preguntas.'}, { priority: 'medium', topic: 'Neumonía Adquirida en Comunidad', description: 'Ver videoclase (CURB-65).'}, { priority: 'low', topic: 'Artritis Reumatoide', description: 'Repaso con flashcards.'} ] },
        { day: 10, type: 'study', specialty: 'Pediatría', tasks: [ { priority: 'high', topic: 'Infecciones Respiratorias Agudas', description: 'Leer GPC y hacer preguntas.'}, { priority: 'medium', topic: 'Enfermedad Diarreica Aguda', description: 'Ver videoclase (Planes de Hidratación).'}, { priority: 'low', topic: 'Ictericia neonatal', description: 'Repaso con flashcards.'} ] },
        { day: 11, type: 'study', specialty: 'Urgencias y Especialidades', tasks: [ { priority: 'high', topic: 'Choque (Séptico, Hipovolémico)', description: 'Ver videoclase.'}, { priority: 'medium', topic: 'Depresión y Ansiedad', description: 'Leer GPC y hacer preguntas.'}, { priority: 'low', topic: 'Sinusitis', description: 'Lectura rápida.'} ] },
        { day: 12, type: 'study', specialty: 'Medicina Interna (Refuerzo)', tasks: [ { priority: 'high', topic: 'Hipertensión Arterial Sistémica', description: 'Leer GPC y ver videoclase.'}, { priority: 'medium', topic: 'Enfermedad Renal Crónica', description: 'Hacer banco de preguntas.'} ] },
        { day: 13, type: 'review', specialty: 'Repaso Inteligente y Simulacro' }
    ];

    const container = document.getElementById('timeline-container');
    const startDate = new Date(); 
    startDate.setDate(startDate.getDate() - 3);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function renderAllDays() {
        container.innerHTML = ''; 
        itineraryData.forEach((item) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + item.day);
            const dateString = dayDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            const dateISO = dayDate.toISOString().split('T')[0];
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.setAttribute('data-date', dateISO);
            
            if (dayDate.getFullYear() === today.getFullYear() && dayDate.getMonth() === today.getMonth() && dayDate.getDate() === today.getDate()) {
                dayCard.classList.add('is-today');
            } else if (dayDate < today) {
                dayCard.classList.add('is-past');
            }
            
            if(item.type === 'review') dayCard.classList.add('is-special-day');
            
            let tasksHtml = '';
            let recommendedTime = 0;

            if (item.type === 'review') {
                tasksHtml = `<button class="review-button">Generar Repaso (Función Premium)</button>`;
                recommendedTime = 4;
            } else {
                item.tasks.forEach((task) => {
                    recommendedTime += timePerPriority[task.priority] || 0;
                });
                tasksHtml = `<ul class="tasks-list">${generateTasksHtml(item.tasks, dateISO)}</ul>`;
            }
            
            const userHours = getUserHoursForDay(dayDate.getDay());
            const timeManagementHtml = createTimeManagementHtml(recommendedTime, userHours);
            const noteId = `note-${dateISO}`;
            const savedNote = localStorage.getItem(noteId) || '';
            const notesHtml = `<div class="notes-section"><label for="${noteId}">Mis Notas del Día:</label><textarea id="${noteId}" placeholder="Anota aquí tus dudas, perlas o datos clave...">${savedNote}</textarea></div>`;

            dayCard.innerHTML = `
                <div class="day-header">
                    <h2>${item.specialty}</h2>
                    <span class="date">${dateString}</span>
                </div>
                ${timeManagementHtml}
                ${tasksHtml}
                ${notesHtml}`;
            container.appendChild(dayCard);
        });
    }

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

    function getUserHoursForDay(dayOfWeek) {
        if (dayOfWeek === 6) return parseFloat(document.getElementById('sim-horas-sabado').value) || 0;
        if (dayOfWeek === 0) return parseFloat(document.getElementById('sim-horas-domingo').value) || 0;
        return parseFloat(document.getElementById('sim-horas-lv').value) || 0;
    }
    
    function updateProgressAndStreak() {
         const allCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
         const progressBar = document.getElementById('general-progress-bar');
         const streakDaysSpan = document.getElementById('streak-days');
         if (!progressBar || !streakDaysSpan || allCheckboxes.length === 0) return;
         const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
         const totalTasks = allCheckboxes.length;
         const percentage = (checkedCount / totalTasks) * 100;
         progressBar.style.width = `${percentage}%`;
         streakDaysSpan.textContent = Math.floor(checkedCount / 3);
    }

    document.getElementById('hours-simulation-form').addEventListener('input', renderAllDays);
    container.addEventListener('change', (e) => { 
        if (e.target.matches('input[type="checkbox"]')) { 
            localStorage.setItem(e.target.id, e.target.checked); 
            updateProgressAndStreak(); 
        } 
    });
    container.addEventListener('input', (e) => { 
        if (e.target.matches('.notes-section textarea')) { 
            localStorage.setItem(e.target.id, e.target.value); 
        } 
    });
    
    renderAllDays();
    updateProgressAndStreak();
    
    const todayCard = document.querySelector('.is-today');
    if (todayCard) { 
        todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
    }
});
