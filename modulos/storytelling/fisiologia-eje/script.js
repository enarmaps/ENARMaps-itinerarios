// =================================================================== //
// JS Específico para "El Viaje del Impulso Eléctrico" v2.0              //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function () {

    // REEMPLAZA esta sección en tu script.js

    // --- LÓGICA PARA EL SIMULADOR DEL EJE CARDÍACO v2.0 ---
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
                axisLine.style.transform = 'rotate(75deg)'; // Eje puede estar normal o ligeramente a la derecha
                axisStatus.textContent = 'Eje Normal o a la Derecha';
                axisExplanation.innerHTML = "<strong>Bloqueo de Rama Derecha:</strong> La activación del ventrículo derecho es tardía. El eje puede no desviarse mucho, pero el QRS se ensancha (no visible en este simulador).";
                break;
            case 'lbbb':
                paths.left.classList.add('blocked');
                blockages.anterior.classList.remove('active'); // Ocultar bloqueos de fascículos
                blockages.posterior.classList.remove('active');
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
        for (const key in paths) {
            paths[key].classList.remove('blocked');
        }
        for (const key in blockages) {
            blockages[key].classList.remove('active');
        }
        axisLine.style.transform = 'rotate(45deg)'; // Eje normal
        axisStatus.textContent = 'Eje Normal (+45°)';
        axisExplanation.innerHTML = 'Haz clic en una rama o fascículo para simular un bloqueo y observar el efecto en el GPS del Reino.';
        currentBlocked = null;
    }
    
    resetBtn.addEventListener('click', resetAxis);
    
    // Estado inicial al cargar
    resetAxis();

    // Activa la animación del primer ECG al cargar la página
    document.getElementById('ecg-strip-1').classList.add('active');

    const anteriorBlockage = document.getElementById('anterior-blockage');
    const posteriorBlockage = document.getElementById('posterior-blockage');
    const axisLine = document.getElementById('axis-line');
    const axisStatus = document.getElementById('axis-status');
    const axisExplanation = document.getElementById('axis-explanation');
    const resetBtn = document.getElementById('reset-axis-btn');

    let currentBlocked = null;

    window.blockPath = function(fascicle) {
        anteriorBlockage.classList.remove('active');
        posteriorBlockage.classList.remove('active');
        
        if (currentBlocked === fascicle) {
            resetAxis();
            return;
        }
        currentBlocked = fascicle;
        if (fascicle === 'anterior') {
            anteriorBlockage.classList.add('active');
            axisLine.style.transform = 'rotate(-45deg)';
            axisStatus.textContent = 'Eje Desviado a la Izquierda (-45°)';
            axisExplanation.innerHTML = "<strong>Hemibloqueo Anterior Izquierdo:</strong> El impulso debe viajar 'hacia arriba' para despolarizar la pared anterolateral, desviando el eje drásticamente a la izquierda.";
        } else if (fascicle === 'posterior') {
            posteriorBlockage.classList.add('active');
            axisLine.style.transform = 'rotate(120deg)';
            axisStatus.textContent = 'Eje Desviado a la Derecha (+120°)';
            axisExplanation.innerHTML = "<strong>Hemibloqueo Posterior Izquierdo:</strong> El impulso debe viajar 'hacia abajo y a la derecha' para despolarizar la pared posteroinferior, desviando el eje a la derecha.";
        }
    }
    
    function resetAxis() {
        anteriorBlockage.classList.remove('active');
        posteriorBlockage.classList.remove('active');
        axisLine.style.transform = 'rotate(45deg)'; // Eje normal
        axisStatus.textContent = 'Eje Normal (+45°)';
        axisExplanation.innerHTML = 'Haz clic en un fascículo para simular un bloqueo y observar cómo se desvía el eje del Reino.';
        currentBlocked = null;
    }
    
    resetBtn.addEventListener('click', resetAxis);

    resetAxis();
});
 // --- LÓGICA PARA EL SIMULADOR DEL EJE CARDÍACO (sin cambios) ---
    const anteriorFascicle = document.getElementById('anterior-fascicle');
    const posteriorFascicle = document.getElementById('posterior-fascicle');
   
