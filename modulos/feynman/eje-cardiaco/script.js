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
    
    let currentBlocked = null;
    
    window.blockPath = function(blockType) {
        if (currentBlocked === blockType) {
            resetAxis();
            return;
        }
        resetAxis();
        currentBlocked = blockType;
    
        switch (blockType) {
            case 'rbbb':
                paths.right.classList.add('blocked');
                axisLine.style.transform = 'rotate(110deg)'; // Eje desviado a la derecha
                axisStatus.textContent = 'Eje Desviado a la Derecha (+110°)';
                axisExplanation.innerHTML = "<strong>Bloqueo de Rama Derecha:</strong> La activación del ventrículo derecho es tardía, desviando las fuerzas finales hacia la derecha.";
                break;
            case 'lbbb':
                paths.left.classList.add('blocked');
                paths.anterior.classList.add('blocked');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda (-60°)';
                axisExplanation.innerHTML = "<strong>Bloqueo de Rama Izquierda:</strong> La activación viaja del VD al VI. El eje se desvía marcadamente a la izquierda.";
                break;
            case 'lafb':
                blockages.anterior.classList.add('active');
                paths.anterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(-60deg)';
                axisStatus.textContent = 'Eje Desviado a la Izquierda (-60°)';
                axisExplanation.innerHTML = "<strong>Hemibloqueo Anterior Izquierdo (HBAI):</strong> El impulso sube por el fascículo posterior, desviando el eje hacia arriba y a la izquierda.";
                break;
            case 'lpfb':
                blockages.posterior.classList.add('active');
                paths.posterior.classList.add('blocked');
                axisLine.style.transform = 'rotate(120deg)';
                axisStatus.textContent = 'Eje Desviado a la Derecha (+120°)';
                axisExplanation.innerHTML = "<strong>Hemibloqueo Posterior Izquierdo (HBPI):</strong> El impulso baja por el fascículo anterior, desviando el eje hacia abajo y a la derecha.";
                break;
        }
    }
    
    function resetAxis() {
        for (const key in paths) { if (paths[key]) { paths[key].classList.remove('blocked'); } }
        for (const key in blockages) { if (blockages[key]) { blockages[key].classList.remove('active'); } }
        if(axisLine) axisLine.style.transform = 'rotate(45deg)';
        if(axisStatus) axisStatus.textContent = 'Eje Normal (+45°)';
        if(axisExplanation) axisExplanation.innerHTML = 'Haz clic en una rama o fascículo para simular un bloqueo y observar el efecto en el GPS del Reino.';
        currentBlocked = null;
    }
    
    if(resetBtn) {
        resetBtn.addEventListener('click', resetAxis);
    }
    
    resetAxis();
});
