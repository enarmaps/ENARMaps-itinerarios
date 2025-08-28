document.addEventListener('DOMContentLoaded', () => {
    // =================================================================== //
    // BASES DE DATOS DE RECURSOS VISUALES                                 //
    // =================================================================== //
    const methodData = {
        "Método Feynman": { image: "https://i.imgur.com/N0NuugZ.png", description: "Consiste en simplificar conceptos complejos hasta poder explicarlos en términos sencillos. Si no puedes explicarlo fácil, no lo entiendes bien." },
        "Mapa Mental": { image: "https://i.imgur.com/jFR9wF9.png", description: "Conecta ideas de forma visual. Ideal para organizar grandes cantidades de información y ver las relaciones entre conceptos clave." },
        "Storytelling": { image: "https://i.imgur.com/WhzCYyu.png", description: "Convierte procesos complejos en historias memorables. Mejora drásticamente la retención al darle una narrativa al conocimiento." },
        "Interleaving": { image: "https://i.imgur.com/hrOF9GF.png", description: "Mezcla problemas de diferentes temas en una misma sesión para forzar al cerebro a discriminar y elegir la estrategia correcta." }
    };
    
    const specialtyIcons = {
        "Cardiología": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
        "Neurología": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v1.42A4.5 4.5 0 0 0 12 12a4.5 4.5 0 0 0 4.5-4.08V6.5A4.5 4.5 0 0 0 12 2Z"/><path d="M12 12v1.14A4.5 4.5 0 0 1 7.5 17.5a4.5 4.5 0 0 1-4.49-4.5h0A4.5 4.5 0 0 1 7.5 8.52V8.5"/><path d="M12 12v1.14A4.5 4.5 0 0 0 16.5 17.5a4.5 4.5 0 0 0 4.49-4.5h0A4.5 4.5 0 0 0 16.5 8.52V8.5"/></svg>',
        "Nefrología": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0-7-7c-1.35 0-2.6.4-3.6 1.15A2 2 0 0 0 1 18v2a2 2 0 0 0 2 2h1.15A7 7 0 0 0 12 22Z"/><path d="M23 18v2a2 2 0 0 1-2 2h-1.15a7 7 0 0 1-6.85-8.15c.5-1.1 1.2-2.1 2-3A7 7 0 0 1 23 9a7 7 0 0 1-7 7c-1.35 0-2.6-.4-3.6-1.15"/></svg>',
        "Endocrinología": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15.5 8.5-3 3-3-3"/><path d="m8.5 15.5 3-3 3 3"/></svg>',
        "Reumatología": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5c-.83-1.25-1.5-2.5-1.5-4.5 0-3 2-5 5-5s5 2 5 5c0 2-1 4-1.5 5.5"/><path d="M19.5 10.5c.83-1.25 1.5-2.5 1.5-4.5 0-3-2-5-5-5s-5 2-5 5c0 2 1 4 1.5 5.5"/><path d="M12 11.5V14l-2 4.5h8L16 14v-2.5"/><path d="m5 21 1-1"/><path d="m19 21-1-1"/></svg>',
        "Diagnóstico Diferencial": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
    };

    // =================================================================== //
    // BASE DE DATOS DE MÓDULOS                                           //
    // =================================================================== //
    const modulesData = [
        // Módulos Originales
        { title: "Mecanismo de Frank-Starling", link: "../modulos/feynman/frank-starling/index.html", specialty: "Cardiología", method: "Método Feynman" },
        { title: "Potencial de Acción Cardíaco", link: "../modulos/feynman/potencial-accion-cardiaco/index.html", specialty: "Cardiología", method: "Método Feynman" },
        { title: "El Viaje del Impulso Eléctrico", link: "../modulos/storytelling/impulso-electrico/index.html", specialty: "Cardiología", method: "Storytelling" },
        { title: "El Eje RAA: Una Historia de Poder", link: "../modulos/storytelling/raa/index.html", specialty: "Nefrología", method: "Storytelling" },
        { title: "El Reto del Dolor Torácico", link: "../modulos/interleaving/dolor-toracico/index.html", specialty: "Diagnóstico Diferencial", method: "Interleaving" },
        
        // Módulos de Neurología
        { title: "Tratamiento del EVC Isquémico", link: "../modulos/mapa/evc-isquemico/index.html", specialty: "Neurología", method: "Mapa Mental" },

        // Módulos de Cardiología (Mapas)
        { title: "Angina Estable", link: "../modulos/mapa/angina-estable/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Fibrilación Auricular", link: "../modulos/mapa/fibrilacion-auricular/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Síndrome Coronario Agudo", link: "../modulos/mapa/sindrome-coronario-agudo/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Insuficiencia Cardiaca Aguda", link: "../modulos/mapa/insuficiencia-cardiaca-aguda/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Insuficiencia Cardiaca Crónica", link: "../modulos/mapa/insuficiencia-cardiaca-cronica/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Hipertensión Arterial Sistémica", link: "../modulos/mapa/HAS/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Taquicardias Supraventriculares", link: "../modulos/mapa/TSV/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Interpretación Sistemática del ECG", link: "../modulos/mapa/EKG/index.html", specialty: "Cardiología", method: "Mapa Mental" },
        { title: "Síncope", link: "../modulos/mapa/sincope/index.html", specialty: "Cardiología", method: "Mapa Mental" },

        // Módulos de Endocrinología (Mapas)
        { title: "Cetoacidosis y Estado Hiperosmolar", link: "../modulos/mapa/CAD&EHO/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Diabetes Mellitus Tipo 1", link: "../modulos/mapa/DM1/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Diabetes Mellitus Tipo 2", link: "../modulos/mapa/DM2/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Dislipidemias", link: "../modulos/mapa/dislipidemias/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Hipertiroidismo", link: "../modulos/mapa/hipertiroidismo/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Hipoglucemia", link: "../modulos/mapa/hipoglucemia/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Hipotiroidismo", link: "../modulos/mapa/hipotiroidismo/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Síndrome Metabólico", link: "../modulos/mapa/sindrome-metabolico/index.html", specialty: "Endocrinología", method: "Mapa Mental" },
        { title: "Osteoporosis", link: "../modulos/mapa/osteoporosis/index.html", specialty: "Reumatología", method: "Mapa Mental" }
    ];

    const gridContainer = document.getElementById('modules-grid');
    const viewBySpecialtyBtn = document.getElementById('view-by-specialty');
    const viewByMethodBtn = document.getElementById('view-by-method');
    let currentView = 'method';

    function createModuleLink(module) {
        return `<a href="${module.link}" class="module-link" target="_blank"><span>${module.title}</span><span class="arrow">→</span></a>`;
    }

    function renderByMethod() {
        gridContainer.innerHTML = '';
        gridContainer.className = 'modules-grid-by-method';
        for (const methodName in methodData) {
            const method = methodData[methodName];
            const relevantModules = modulesData.filter(m => m.method === methodName);
            if (relevantModules.length === 0) continue;

            // Agrupar módulos por especialidad dentro de este método
            const groupedBySpecialty = relevantModules.reduce((acc, module) => {
                if (!acc[module.specialty]) acc[module.specialty] = [];
                acc[module.specialty].push(module);
                return acc;
            }, {});

            let accordionHtml = '<div class="specialty-accordion">';
            for (const specialtyName in groupedBySpecialty) {
                const specialtyModules = groupedBySpecialty[specialtyName];
                accordionHtml += `
                    <details class="specialty-accordion-item">
                        <summary>${specialtyIcons[specialtyName] || ''} ${specialtyName}</summary>
                        <div class="module-links-container">
                            ${specialtyModules.map(createModuleLink).join('')}
                        </div>
                    </details>
                `;
            }
            accordionHtml += '</div>';

            const methodCard = document.createElement('div');
            methodCard.className = 'method-card';
            methodCard.innerHTML = `
                <div class="method-card-header" style="background-image: url('${method.image}')"></div>
                <div class="method-card-content">
                    <h2 class="method-card-title">${methodName}</h2>
                    <p class="method-card-description">${method.description}</p>
                    <div class="method-card-modules">
                        <h4>Módulos Disponibles:</h4>
                        ${accordionHtml}
                    </div>
                </div>`;
            gridContainer.appendChild(methodCard);
        }
    }

    function renderBySpecialty() {
        gridContainer.innerHTML = '';
        gridContainer.className = 'modules-grid-by-specialty';
        const grouped = modulesData.reduce((acc, module) => {
            if (!acc[module.specialty]) acc[module.specialty] = [];
            acc[module.specialty].push(module);
            return acc;
        }, {});
        const sortedGroupNames = Object.keys(grouped).sort();
        sortedGroupNames.forEach((groupName, index) => {
            const groupWrapper = document.createElement('div');
            const colorClass = `color-theme-${(index % 3) + 1}`;
            groupWrapper.className = `specialty-group ${colorClass}`;
            let modulesHtml = grouped[groupName].map(createModuleLink).join('');
            groupWrapper.innerHTML = `
                <div class="specialty-header">
                    <div class="specialty-icon">${specialtyIcons[groupName] || ''}</div>
                    <h2 class="specialty-title">${groupName}</h2>
                </div>
                <div class="specialty-modules-list">
                    ${modulesHtml}
                </div>`;
            gridContainer.appendChild(groupWrapper);
        });
    }

    viewBySpecialtyBtn.addEventListener('click', () => {
        if (currentView !== 'specialty') {
            currentView = 'specialty';
            renderBySpecialty();
            viewBySpecialtyBtn.classList.add('active');
            viewByMethodBtn.classList.remove('active');
        }
    });
    viewByMethodBtn.addEventListener('click', () => {
        if (currentView !== 'method') {
            currentView = 'method';
            renderByMethod();
            viewByMethodBtn.classList.add('active');
            viewBySpecialtyBtn.classList.remove('active');
        }
    });
    
    renderByMethod();
});

