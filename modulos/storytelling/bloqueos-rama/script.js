document.addEventListener('DOMContentLoaded', function() {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const btnNormal = document.getElementById('btn-normal');
    const btnRBBB = document.getElementById('btn-rbbb');
    const btnLBBB = document.getElementById('btn-lbbb');
    const allButtons = [btnNormal, btnRBBB, btnLBBB];

    const explanationBox = document.getElementById('explanation-box');
    
    // Referencias a las "superautopistas" en el SVG
    const rightBranch = document.getElementById('right-bundle-branch');
    const leftBranch = document.getElementById('left-bundle-branch');
    const leftAnterior = document.getElementById('left-anterior-fascicle');
    const leftPosterior = document.getElementById('left-posterior-fascicle');
    const allBranches = [rightBranch, leftBranch, leftAnterior, leftPosterior];

    // El "pulso" de luz que se animará
    const pulse = document.getElementById('pulse');
    let currentAnimation; // Para controlar la animación en curso

    // --- LÓGICA DE LA ANIMACIÓN ---

    /**
     * Anima el pulso a lo largo de un camino SVG.
     * @param {SVGPathElement} pathElement - El elemento <path> a seguir.
     * @param {number} duration - La duración de la animación en milisegundos.
     */
    function animatePulse(pathElement, duration) {
        let startTime = null;
        const pathLength = pathElement.getTotalLength();
        pulse.style.opacity = '1';

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;
            
            if (progress < 1) {
                const point = pathElement.getPointAtLength(progress * pathLength);
                pulse.setAttribute('cx', point.x);
                pulse.setAttribute('cy', point.y);
                currentAnimation = requestAnimationFrame(animationStep);
            } else {
                const finalPoint = pathElement.getPointAtLength(pathLength);
                pulse.setAttribute('cx', finalPoint.x);
                pulse.setAttribute('cy', finalPoint.y);
                pulse.style.opacity = '0';
            }
        }
        currentAnimation = requestAnimationFrame(animationStep);
    }

    /**
     * Resetea el simulador a su estado inicial.
     */
    function resetSimulator() {
        cancelAnimationFrame(currentAnimation); // Detiene cualquier animación en curso
        allBranches.forEach(branch => branch.classList.remove('blocked'));
        pulse.style.opacity = '0';
        explanationBox.textContent = 'Selecciona una opción para ver la animación y la explicación.';
        allButtons.forEach(btn => btn.classList.remove('active'));
    }

    // --- EVENT LISTENERS PARA LOS BOTONES ---

    btnNormal.addEventListener('click', () => {
        resetSimulator();
        btnNormal.classList.add('active');
        explanationBox.innerHTML = "<strong>Ritmo Normal:</strong> El impulso viaja simultáneamente por ambas ramas, asegurando una contracción rápida y sincronizada.";
        
        // Animamos ambas ramas al mismo tiempo
        animatePulse(rightBranch, 1000);
        animatePulse(leftBranch, 800);
        animatePulse(leftAnterior, 800);
        animatePulse(leftPosterior, 800);
    });

    btnRBBB.addEventListener('click', () => {
        resetSimulator();
        btnRBBB.classList.add('active');
        rightBranch.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Bloqueo de Rama Derecha:</strong> El impulso baja rápido por la izquierda, pero debe viajar 'a pie' por el músculo para llegar al ventrículo derecho, causando un retraso.";
        
        // Animamos la rama izquierda rápido y la derecha no se anima
        animatePulse(leftBranch, 800);
        animatePulse(leftAnterior, 800);
        animatePulse(leftPosterior, 800);
    });

    btnLBBB.addEventListener('click', () => {
        resetSimulator();
        btnLBBB.classList.add('active');
        leftBranch.classList.add('blocked');
        leftAnterior.classList.add('blocked');
        leftPosterior.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Bloqueo de Rama Izquierda:</strong> El impulso baja por la derecha y luego viaja lentamente a través del músculo hacia la izquierda. Es un retraso significativo.";
        
        // Animamos solo la rama derecha
        animatePulse(rightBranch, 1000);
    });

});
