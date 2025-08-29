/**
 * ENARMaps - Lógica para Storytelling: Fisiología y Eje Cardíaco
 * Versión: 1.0
 */

document.addEventListener('DOMContentLoaded', function () {
    // Llama a las funciones específicas para este módulo.
    setupSceneReveal();
    setupAxisSimulator();
});


// --- MÓDULO 1: REVELAR ESCENAS SECUENCIALES ---
function setupSceneReveal() {
    // La función se hace global para que el `onclick` del HTML la pueda encontrar.
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


// --- MÓDULO 2: SIMULADOR INTERACTIVO DEL EJE CARDÍACO ---
function setupAxisSimulator() {
    // Verifica si los elementos del simulador existen en la página. Si no, no hace nada.
    const axisSimulator = document.querySelector('.cardiac-simulator-container');
    if (!axisSimulator) return;

    // Referencias a los elementos del simulador
    const axisArrow = document.getElementById('axis-arrow');
    const descriptionBox = document.getElementById('axis-description');
    const resetButton = document.getElementById('reset-axis-button');
    
    const hotspotHBAI = document.getElementById('hotspot-hbai');
    const hotspotHBPI = document.getElementById('hotspot-hbpi');

    const pathHBAI = document.getElementById('path-hbai');
    const pathHBPI = document.getElementById('path-hbpi');

    // "Base de datos" con la información para cada estado del simulador
    const axisData = {
        'normal': {
            angle: 45, // Eje normal a +45 grados
            description: 'Eje Eléctrico Normal. El impulso viaja por ambas rutas (fascículos) de la rama izquierda de forma equilibrada.'
        },
        'hbai': {
            angle: -60, // Eje desviado a la izquierda
            description: 'Hemibloqueo Anterior Izquierdo (HBAI): Se bloquea el fascículo anterior. El impulso se desvía "hacia arriba y a la izquierda", jalando el eje.'
        },
        'hbpi': {
            angle: 120, // Eje desviado a la derecha
            description: 'Hemibloqueo Posterior Izquierdo (HBPI): Se bloquea el fascículo posterior. El impulso se desvía "hacia abajo y a la derecha", jalando el eje.'
        }
    };

    // Función central que actualiza la interfaz
    function updateSimulator(state) {
        const data = axisData[state];
        if (!data) return;

        // 1. Mover la flecha del eje
        axisArrow.style.transform = `rotate(${data.angle}deg)`;

        // 2. Actualizar la descripción
        descriptionBox.textContent = data.description;

        // 3. Actualizar el estilo visual del corazón
        pathHBAI.classList.remove('blocked-path');
        pathHBPI.classList.remove('blocked-path');

        if (state === 'hbai') {
            pathHBAI.classList.add('blocked-path');
        } else if (state === 'hbpi') {
            pathHBPI.classList.add('blocked-path');
        }
    }

    // --- Asignar los Eventos de Clic ---

    hotspotHBAI.addEventListener('click', () => updateSimulator('hbai'));
    hotspotHBPI.addEventListener('click', () => updateSimulator('hbpi'));
    resetButton.addEventListener('click', () => updateSimulator('normal'));

    // Iniciar el simulador en estado normal
    updateSimulator('normal');
}
