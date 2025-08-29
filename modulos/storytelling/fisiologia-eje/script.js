// =================================================================== //
// JS Específico para "El Viaje del Impulso Eléctrico" v2.0              //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA PARA REVELAR ESCENAS Y ACTIVAR ECG ---
    window.revealScene = function(sceneId) {
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.style.display = 'block';
            setTimeout(() => {
                scene.style.opacity = '1';
                scene.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Activa la animación del ECG correspondiente
                const ecgStrip = scene.querySelector('.ecg-strip');
                if (ecgStrip) {
                    ecgStrip.classList.add('active');
                }
            }, 10);
        }
    }

    // Activa la animación del primer ECG al cargar la página
    document.getElementById('ecg-strip-1').classList.add('active');

    // --- LÓGICA PARA EL SIMULADOR DEL EJE CARDÍACO (sin cambios) ---
    const anteriorFascicle = document.getElementById('anterior-fascicle');
    const posteriorFascicle = document.getElementById('posterior-fascicle');
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
