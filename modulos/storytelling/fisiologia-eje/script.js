// =================================================================== //
// JS Final y Completo para "El Viaje del Impulso Eléctrico"           //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA PARA REVELAR ESCENAS ---
    // Esta función es llamada por los botones "onclick" en el HTML
    window.revealScene = function(sceneId) {
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.style.display = 'block';
            // Pequeño delay para que el navegador renderice el display:block antes de la animación de opacidad
            setTimeout(() => {
                scene.style.opacity = '1';
                scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 10);
        }
    }

    // --- LÓGICA PARA EL SIMULADOR DEL EJE CARDÍACO ---
    const paths = {
        left: document.getElementById('left-branch'),
        right: document.getElementById('right-branch'),
        anterior: document.getElementById('anterior-fascicle'),
        posterior: document.getElementById('posterior-fascicle')
    };
    const blockages = {
        anterior: document.getElementById('anterior-blockage'),
        posterior: document.getElementById('posterior-blockage')
    };
    const axisLine = document.getElementById('axis-line');
    const axisStatus = document.getElementById('axis-status');
    const axisExplanation = document.getElementById('axis-explanation');
    const resetBtn = document.getElementById('reset-axis-btn');
    
    let currentBlocked = null;
    
    // Hacemos la función global para que el HTML pueda llamarla
    window.blockPath = function(blockType) {
        if (currentBlocked === blockType) {
            resetAxis();
            return;
        }
        resetAxis(); // Resetea antes de aplicar el nuevo bloqueo
        currentBlocked = blockType;
    
        switch (blockType) {
            case 'rbbb':
                paths.right.classList.add('blocked');
                axisLine.style.transform = 'rotate(75deg)';
                axisStatus.textContent = 'Eje Normal o a la Derecha';
                axisExplanation.innerHTML = "<strong>Bloqueo de Rama Derecha:</strong> La activación del ventrículo derecho es tardía. El eje puede no desviarse mucho, pero el QRS se ensancha (no visible en este simulador).";
                break;
            case 'lbbb':
                paths.left.classList.add('blocked');
                paths.anterior.classList.add('blocked');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda';
                axisExplanation.innerHTML = "<strong>Bloqueo de Rama Izquierda:</strong> La activación viaja del ventrículo derecho al izquierdo. El eje se desvía marcadamente a la izquierda y el QRS se ensancha.";
                break;
            case 'lafb':
                blockages.anterior.classList.add('active');
                paths.anterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda';
                axisExplanation.innerHTML = "<strong>Hemibloqueo Anterior Izquierdo (HBAI):</strong> El impulso sube por el fascículo posterior y luego baja para activar la pared anterolateral, desviando el eje hacia arriba y a la izquierda.";
                break;
            case 'lpfb':
                blockages.posterior.classList.add('active');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(120deg)';
                axisStatus.textContent = 'Eje Desviado a la Derecha';
                axisExplanation.innerHTML = "<strong>Hemibloqueo Posterior Izquierdo (HBPI):</strong> El impulso baja por el fascículo anterior y luego sube, activando la pared posteroinferior de forma tardía. Esto desvía el eje hacia abajo y a la derecha.";
                break;
        }
    }
    
    function resetAxis() {
        // Itera sobre el objeto de paths para remover la clase 'blocked'
        for (const key in paths) {
            if (paths[key]) { // Verifica que el elemento exista antes de manipularlo
                paths[key].classList.remove('blocked');
            }
        }
        // Itera sobre el objeto de blockages para remover la clase 'active'
        for (const key in blockages) {
            if (blockages[key]) {
                blockages[key].classList.remove('active');
            }
        }

        // Resetea los elementos visuales del eje
        if(axisLine) axisLine.style.transform = 'rotate(45deg)'; // Eje normal
        if(axisStatus) axisStatus.textContent = 'Eje Normal (+45°)';
        if(axisExplanation) axisExplanation.innerHTML = 'Haz clic en una rama o fascículo para simular un bloqueo y observar el efecto en el GPS del Reino.';
        
        currentBlocked = null;
    }
    
    // Añade el event listener solo si el botón de reset existe
    if(resetBtn) {
        resetBtn.addEventListener('click', resetAxis);
    }
    
    // Estado inicial del simulador al cargar la página
    resetAxis();
});
