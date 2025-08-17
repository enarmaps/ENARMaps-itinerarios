document.addEventListener('DOMContentLoaded', function() {

    // =================================================================================
    // PARTE 1: BASE DE DATOS DEL TEMARIO (VERSIÓN DEMO)
    // =================================================================================

    const temarioCompleto = {
        "🤱 Ginecología y Obstetricia": {
            "🤱 Obstetricia": [
                { name: "Control prenatal", priority: "Alta" },
                { name: "Trabajo de parto normal", priority: "Alta" },
                { name: "Preeclampsia", priority: "Alta" },
                { name: "Eclampsia", priority: "Alta" },
                { name: "Diabetes gestacional", priority: "Alta" },
                { name: "Hemorragia obstétrica", priority: "Alta" },
                { name: "Aborto", priority: "Media" },
                { name: "Embarazo ectópico", priority: "Media" },
                { name: "Distocias", priority: "Media" },
                { name: "Parto pretérmino", priority: "Media" },
                { name: "Ruptura prematura de membranas", priority: "Media" },
                { name: "Enfermedad trofoblástica gestacional", priority: "Media" },
                { name: "Restricción del crecimiento intrauterino (RCIU)", priority: "Media" },
                { name: "Placenta previa", priority: "Media" },
                { name: "Desprendimiento prematuro de placenta", priority: "Media" },
                { name: "Isoinmunización materno-fetal (Rh)", priority: "Baja" },
                { name: "Violencia de género en el embarazo", priority: "Baja" }
            ],
            "👩 Ginecología": [
                { name: "Trastornos menstruales", priority: "Alta" },
                { name: "Síndrome de ovarios poliquísticos", priority: "Alta" },
                { name: "Infecciones vulvovaginales e ITS", priority: "Alta" },
                { name: "Cáncer cervicouterino", priority: "Alta" },
                { name: "Cáncer de mama", priority: "Alta" },
                { name: "Enfermedad pélvica inflamatoria", priority: "Media" },
                { name: "Endometriosis", priority: "Media" },
                { name: "Miomatosis uterina", priority: "Media" },
                { name: "Cáncer de ovario", priority: "Media" },
                { name: "Cáncer de endometrio", priority: "Media" },
                { name: "Torsión ovárica", priority: "Media" },
                { name: "Abordaje de la pareja infértil", priority: "Media" },
                { name: "Menopausia", priority: "Baja" }
            ],
            "👨‍👩‍👧‍👦 Planificación Familiar": [
                { name: "Anticoncepción hormonal", priority: "Media" },
                { name: "Interrupción legal del embarazo", priority: "Media" },
                { name: "Dispositivo intrauterino", priority: "Media" },
                { name: "Anticoncepción de emergencia", priority: "Media" },
                { name: "Métodos de barrera y espermicidas", priority: "Baja" },
                { name: "Métodos basados en el conocimiento de la fertilidad", priority: "Baja" },
                { name: "Esterilización quirúrgica", priority: "Baja" }
            ],
            "🤰 Medicina Materno-Fetal": [
                { name: "Ultrasonido obstétrico", priority: "Media" },
                { name: "Diagnóstico prenatal", priority: "Media" },
                { name: "Cardiopatía y embarazo", priority: "Media" },
                { name: "Enfermedad tiroidea y embarazo", priority: "Media" },
                { name: "Lupus eritematoso sistémico y embarazo", priority: "Baja" },
                { name: "Colestasis intrahepática del embarazo", priority: "Baja" },
                { name: "Trombofilia y embarazo", priority: "Baja" },
                { name: "Malformaciones congénitas", priority: "Baja" }
            ]
        }
    };

    
    // =================================================================================
    // PARTE 2: LÓGICA PARA RENDERIZAR EL TEMARIO Y REFERENCIAS AL DOM
    // (Esta parte es idéntica a la del temario original)
    // =================================================================================

    const specialtiesContainer = document.getElementById('specialties-container');
    const searchInput = document.getElementById('searchInput');
    const progressBarFillGeneral = document.getElementById('progress-bar-fill-general');
    const progressTextGeneral = document.getElementById('progress-text-general');
    const progressBarFillAlta = document.getElementById('progress-bar-fill-alta');
    const progressTextAlta = document.getElementById('progress-text-alta');
    const progressBarFillMedia = document.getElementById('progress-bar-fill-media');
    const progressTextMedia = document.getElementById('progress-text-media');
    const progressBarFillBaja = document.getElementById('progress-bar-fill-baja');
    const progressTextBaja = document.getElementById('progress-text-baja');

    let completedTopics = new Set();
    const STORAGE_KEY = 'enarmaps_demo_completed_topics'; 
    const topicCounts = { total: 0, alta: 0, media: 0, baja: 0 };

    function renderTemario() {
        let specialtiesHtml = '';
        for (const specialtyName in temarioCompleto) {
            const subspecialties = temarioCompleto[specialtyName];
            let subspecialtiesHtml = '';
            let specialtyTopicCount = 0;
            for (const subspecialtyName in subspecialties) {
                const topics = subspecialties[subspecialtyName];
                let topicsHtml = '';
                topics.forEach(topic => {
                    const topicId = (specialtyName + '-' + subspecialtyName + '-' + topic.name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    topicsHtml += `
                        <div class="topic-item" data-topic-id="${topicId}" data-priority="${topic.priority.toLowerCase()}">
                            <div class="completion-status"></div>
                            <span class="topic-name">${topic.name}</span>
                            <span class="priority-badge priority-${topic.priority.toLowerCase()}">${topic.priority}</span>
                        </div>`;
                });
                specialtyTopicCount += topics.length;
                subspecialtiesHtml += `
                    <div class="subspecialty">
                        <div class="subspecialty-header">
                            <span class="subspecialty-title">${subspecialtyName}</span>
                            <span class="expand-icon">▼</span>
                        </div>
                        <div class="subspecialty-content">
                            <div class="topics-grid">${topicsHtml}</div>
                        </div>
                    </div>`;
            }
            specialtiesHtml += `
                <div class="specialty-section">
                    <div class="specialty-header">
                        <span class="specialty-title">${specialtyName}</span>
                        <span class="specialty-count">${specialtyTopicCount} temas</span>
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="specialty-content">${subspecialtiesHtml}</div>
                </div>`;
        }
        specialtiesContainer.innerHTML = specialtiesHtml;
    }

    function calculateTotalTopics() {
        for (const specialtyName in temarioCompleto) {
            for (const subspecialtyName in temarioCompleto[specialtyName]) {
                const topics = temarioCompleto[specialtyName][subspecialtyName];
                topics.forEach(topic => {
                    topicCounts.total++;
                    const priority = topic.priority.toLowerCase();
                    if (topicCounts.hasOwnProperty(priority)) {
                        topicCounts[priority]++;
                    }
                });
            }
        }
    }

    function updateAllProgress() {
        const completedCount = completedTopics.size;
        const completedCountsByPriority = { alta: 0, media: 0, baja: 0 };
        completedTopics.forEach(topicId => {
            const topicEl = document.querySelector(`.topic-item[data-topic-id="${topicId}"]`);
            if (topicEl) {
                const priority = topicEl.dataset.priority;
                if (completedCountsByPriority.hasOwnProperty(priority)) {
                    completedCountsByPriority[priority]++;
                }
            }
        });

        if (topicCounts.total > 0) {
            const percentage = Math.round((completedCount / topicCounts.total) * 100);
            progressBarFillGeneral.style.width = percentage + '%';
            progressTextGeneral.textContent = percentage + '%';
        }
        if (topicCounts.alta > 0) {
            const percentageAlta = Math.round((completedCountsByPriority.alta / topicCounts.alta) * 100);
            progressBarFillAlta.style.width = percentageAlta + '%';
            progressTextAlta.textContent = `${completedCountsByPriority.alta}/${topicCounts.alta}`;
        } else {
             progressTextAlta.textContent = `0/0`;
        }
        if (topicCounts.media > 0) {
            const percentageMedia = Math.round((completedCountsByPriority.media / topicCounts.media) * 100);
            progressBarFillMedia.style.width = percentageMedia + '%';
            progressTextMedia.textContent = `${completedCountsByPriority.media}/${topicCounts.media}`;
        } else {
            progressTextMedia.textContent = `0/0`;
        }
        if (topicCounts.baja > 0) {
            const percentageBaja = Math.round((completedCountsByPriority.baja / topicCounts.baja) * 100);
            progressBarFillBaja.style.width = percentageBaja + '%';
            progressTextBaja.textContent = `${completedCountsByPriority.baja}/${topicCounts.baja}`;
        } else {
            progressTextBaja.textContent = `0/0`;
        }
    }

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedTopics)));
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
            const completedIds = JSON.parse(savedProgress);
            completedTopics = new Set(completedIds);
            completedIds.forEach(id => {
                const topicEl = document.querySelector(`.topic-item[data-topic-id="${id}"]`);
                if (topicEl) {
                    topicEl.classList.add('completed');
                }
            });
        }
    }

    specialtiesContainer.addEventListener('click', function(e) {
        const target = e.target;
        const topicItem = target.closest('.topic-item');
        if (topicItem) {
            const topicId = topicItem.dataset.topicId;
            topicItem.classList.toggle('completed');
            if (completedTopics.has(topicId)) {
                completedTopics.delete(topicId);
            } else {
                completedTopics.add(topicId);
            }
            saveProgress();
            updateAllProgress();
            return; 
        }
        const specialtyHeader = target.closest('.specialty-header');
        if (specialtyHeader) {
            specialtyHeader.nextElementSibling.classList.toggle('active');
            specialtyHeader.querySelector('.expand-icon').classList.toggle('rotated');
        }
        const subspecialtyHeader = target.closest('.subspecialty-header');
        if (subspecialtyHeader) {
            subspecialtyHeader.nextElementSibling.classList.toggle('active');
            subspecialtyHeader.querySelector('.expand-icon').classList.toggle('rotated');
        }
    });
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const allTopicItems = document.querySelectorAll('.topic-item');
        allTopicItems.forEach(item => {
            const topicName = item.querySelector('.topic-name').textContent.toLowerCase();
            const matches = topicName.includes(searchTerm);
            item.style.display = matches ? 'flex' : 'none';
        });

        if (searchTerm) {
            document.querySelectorAll('.specialty-content, .subspecialty-content').forEach(content => {
                const hasVisibleItem = content.querySelector('.topic-item[style*="display: flex"]');
                if (hasVisibleItem) {
                    content.classList.add('active');
                    const headerIcon = content.previousElementSibling.querySelector('.expand-icon');
                    if (headerIcon) headerIcon.classList.add('rotated');
                } else {
                    content.classList.remove('active');
                    const headerIcon = content.previousElementSibling.querySelector('.expand-icon');
                    if (headerIcon) headerIcon.classList.remove('rotated');
                }
            });
        } else {
             document.querySelectorAll('.specialty-content.active, .subspecialty-content.active').forEach(content => {
                content.classList.remove('active');
                const headerIcon = content.previousElementSibling.querySelector('.expand-icon');
                if (headerIcon) headerIcon.classList.remove('rotated');
            });
        }
    });

    renderTemario();
    calculateTotalTopics();
    loadProgress();
    updateAllProgress();
});