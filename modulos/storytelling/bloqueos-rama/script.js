document.addEventListener('DOMContentLoaded', function() {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const btnNormal = document.getElementById('btn-normal');
    const btnRBBB = document.getElementById('btn-rbbb');
    const btnLBBB = document.getElementById('btn-lbbb');
    const btnLAFH = document.getElementById('btn-lafh');
    const btnLPFH = document.getElementById('btn-lpfh');
    const allButtons = [btnNormal, btnRBBB, btnLBBB, btnLAFH, btnLPFH];

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

    // --- VALIDACIÓN DOM ---
    if (!btnNormal || !btnRBBB || !btnLBBB || !btnLAFH || !btnLPFH || !explanationBox || !rightBranch || !leftBranch || !leftAnterior || !leftPosterior || !pulse) {
        console.warn('Algunos elementos DOM no se encontraron. Verifique el HTML.');
        return;
    }

    // --- LÓGICA DE LA ANIMACIÓN ---

    /**
     * Anima el pulso a lo largo de un camino SVG.
     * @param {SVGPathElement} pathElement - El elemento <path> a seguir.
     * @param {number} duration - La duración de la animación en milisegundos.
     */
    function animatePulse(pathElement, duration) {
        try {
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
        } catch (e) {
            console.error('Animación fallida:', e);
        }
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
        explanationBox.innerHTML = "<strong>Ritmo Normal:</strong> El impulso viaja simultáneamente por ambas ramas, asegurando un QRS estrecho (<0.12s) (GPC México/CENETEC).";
        
        // Animaciones sincronizadas con retraso
        animatePulse(leftBranch, 800).then(() => {
            Promise.all([
                animatePulse(leftAnterior, 800),
                animatePulse(leftPosterior, 800),
                animatePulse(rightBranch, 800)
            ]);
        });
    });

    btnRBBB.addEventListener('click', () => {
        resetSimulator();
        btnRBBB.classList.add('active');
        rightBranch.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Bloqueo de Rama Derecha:</strong> El impulso baja rápido por la izquierda, pero se retrasa en el VD, causando QRS ancho (>0.12s) con rSR' en V1 (AHA 2022).";
    
        // Animación con retraso en la rama derecha
        animatePulse(leftBranch, 600).then(() => {
            Promise.all([
                animatePulse(leftAnterior, 600),
                animatePulse(leftPosterior, 600)
            ]).then(() => {
                setTimeout(() => animatePulse(rightBranch, 1200), 400);
            });
        });
        // Feedback temporal
        setTimeout(() => explanationBox.innerHTML += ' (Retraso visible por 3s)', 0);
        setTimeout(() => explanationBox.innerHTML = explanationBox.innerHTML.replace(' (Retraso visible por 3s)', ''), 3000);
    });

    btnLBBB.addEventListener('click', () => {
        resetSimulator();
        btnLBBB.classList.add('active');
        leftBranch.classList.add('blocked');
        leftAnterior.classList.add('blocked');
        leftPosterior.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Bloqueo de Rama Izquierda:</strong> El impulso baja por la derecha y se retrasa hacia la izquierda, causando QRS ancho (>0.12s) con R ancha en V5-V6 (AHA 2022).";
        
        animatePulse(rightBranch, 1000);
        // Feedback temporal
        setTimeout(() => explanationBox.innerHTML += ' (Retraso visible por 3s)', 0);
        setTimeout(() => explanationBox.innerHTML = explanationBox.innerHTML.replace(' (Retraso visible por 3s)', ''), 3000);
    });

    btnLAFH.addEventListener('click', () => {
        resetSimulator();
        btnLAFH.classList.add('active');
        leftAnterior.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Hemibloqueo Anterior Izquierdo:</strong> El impulso se retrasa en el fascículo anterior, desviando el eje a -60° con QRS estrecho, qR en I/aVL (AHA 2022).";
        
        animatePulse(leftBranch, 600).then(() => {
            animatePulse(leftPosterior, 600).then(() => {
                setTimeout(() => animatePulse(leftAnterior, 1200), 400);
            });
        });
        // Feedback temporal
        setTimeout(() => explanationBox.innerHTML += ' (Retraso visible por 3s)', 0);
        setTimeout(() => explanationBox.innerHTML = explanationBox.innerHTML.replace(' (Retraso visible por 3s)', ''), 3000);
    });

    btnLPFH.addEventListener('click', () => {
        resetSimulator();
        btnLPFH.classList.add('active');
        leftPosterior.classList.add('blocked');
        explanationBox.innerHTML = "<strong>Hemibloqueo Posterior Izquierdo:</strong> El impulso se retrasa en el fascículo posterior, desviando el eje a +120° con QRS estrecho, qR en II/III/aVF (AHA 2022).";
        
        animatePulse(leftBranch, 600).then(() => {
            animatePulse(leftAnterior, 600).then(() => {
                setTimeout(() => animatePulse(leftPosterior, 1200), 400);
            });
        });
        // Feedback temporal
        setTimeout(() => explanationBox.innerHTML += ' (Retraso visible por 3s)', 0);
        setTimeout(() => explanationBox.innerHTML = explanationBox.innerHTML.replace(' (Retraso visible por 3s)', ''), 3000);
    });

    resetSimulator();
});
