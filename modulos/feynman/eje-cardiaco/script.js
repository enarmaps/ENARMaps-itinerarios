// =================================================================== //
// JS Específico para el Módulo Feynman "El GPS del Corazón"           //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function () {

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
    
    // Validación DOM
    if (!paths.left || !paths.right || !paths.anterior || !paths.posterior || !blockages.anterior || !blockages.posterior || !axisLine || !axisStatus || !axisExplanation || !resetBtn) {
        console.warn('Algunos elementos DOM no se encontraron. Verifique el HTML.');
        return;
    }
    
    let currentBlocked = null;
    
    window.blockPath = function(blockType) {
        if (currentBlocked === blockType && currentBlocked !== null) return;
        resetAxis();
        currentBlocked = blockType;
        
        if (!axisLine || !axisStatus || !axisExplanation) return;
        
        switch (blockType) {
            case 'rbbb':
                paths.right.classList.add('blocked');
                axisLine.style.transform = 'rotate(110deg)';
                axisStatus.textContent = 'Eje Desviado a la Derecha (+110°)';
                axisExplanation.innerHTML = '<strong>Bloqueo de Rama Derecha:</strong> Desvía el eje hacia la derecha por activación tardía del VD.';
                break;
            case 'lbbb':
                paths.left.classList.add('blocked');
                paths.anterior.classList.add('blocked');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda (-60°)';
                axisExplanation.innerHTML = '<strong>Bloqueo de Rama Izquierda:</strong> Desvía el eje a la izquierda por cambio de ruta al VD.';
                break;
            case 'lafb':
                blockages.anterior.classList.add('active');
                paths.anterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda (-60°)';
                axisExplanation.innerHTML = '<strong>Hemibloqueo Anterior Izquierdo:</strong> Desvía el eje por un bloqueo parcial arriba-izquierda.';
                break;
            case 'lpfb':
                blockages.posterior.classList.add('active');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(120deg)';
                axisStatus.textContent = 'Eje Desviado a la Derecha (+120°)';
                axisExplanation.innerHTML = '<strong>Hemibloqueo Posterior Izquierdo:</strong> Desvía el eje por bloqueo parcial abajo-derecha.';
                break;
        }
        // Feedback temporal (sugerencia para implementación futura)
        setTimeout(() => axisExplanation.innerHTML += ' (Efecto visible por 3s)', 0);
        setTimeout(() => axisExplanation.innerHTML = axisExplanation.innerHTML.replace(' (Efecto visible por 3s)', ''), 3000);
    }
    
    function resetAxis() {
        if (!axisLine || !axisStatus || !axisExplanation) return;
        for (const key in paths) { if (paths[key]) paths[key].classList.remove('blocked'); }
        for (const key in blockages) { if (blockages[key]) blockages[key].classList.remove('active'); }
        axisLine.style.transform = 'rotate(45deg)';
        axisStatus.textContent = 'Eje Normal (+45°, rango -30° a +90°, no hay valor único)';
        axisExplanation.innerHTML = 'Haz clic en una rama o fascículo para simular un bloqueo y ver su efecto en el eje.';
        currentBlocked = null;
    }
    
    if(resetBtn) {
        resetBtn.addEventListener('click', resetAxis);
    }
    
    resetAxis();
});
