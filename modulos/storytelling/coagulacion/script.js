document.addEventListener('DOMContentLoaded', function() {
    const factors = document.querySelectorAll('.factor');
    const arrows = document.querySelectorAll('.arrow');
    const explanationBox = document.getElementById('explanation-box');
    const epilogue = document.getElementById('epilogue');

    let currentStep = 1;

    const explanations = {
        1: "Lesión tisular activa el Factor VII. ¡La Vía Extrínseca ha comenzado!",
        2: "El contacto con el colágeno activa el Factor XII. Haz clic en él para iniciar la Vía Intrínseca.",
        3: "¡Correcto! XII activa a XI.",
        4: "XI activa a IX. El Factor VIII se une como cofactor.",
        5: "Ambas vías convergen activando al Factor X. ¡La Vía Común ha comenzado!",
        6: "X, con su cofactor V, activa la Protrombina (II).",
        7: "La Protrombina se convierte en Trombina, la enzima clave.",
        8: "La Trombina actúa sobre el Fibrinógeno (I).",
        9: "¡Misión cumplida! Se forma la Malla de Fibrina, el coágulo estable."
    };

    function updateCascade(step) {
        // Activar factor actual
        const currentFactor = document.querySelector(`.factor[data-step="${step}"]`);
        if (currentFactor) {
            currentFactor.classList.add('active');
            currentFactor.classList.remove('clickable');
        }

        // Activar flecha anterior
        let previousArrow;
        if (step === 3) previousArrow = document.getElementById('arrow-12-11');
        if (step === 4) previousArrow = document.getElementById('arrow-11-9');
        if (step === 5) {
            previousArrow = document.getElementById('arrow-9-10');
            const extrinsicArrow = document.getElementById('arrow-7-10');
            if(extrinsicArrow) extrinsicArrow.classList.add('active');
            // Activar cofactores
            document.getElementById('factor-8')?.classList.add('active');
        }
        if (step === 6) {
            previousArrow = document.getElementById('arrow-10-2');
            document.getElementById('factor-5')?.classList.add('active');
        }
        if (step === 7) previousArrow = document.getElementById('arrow-2-2a');
        if (step === 8) previousArrow = document.getElementById('arrow-2a-1');
        if (step === 9) previousArrow = document.getElementById('arrow-1-1a');

        if (previousArrow) {
            previousArrow.classList.add('active');
        }

        // Actualizar explicación
        if (explanations[step]) {
            explanationBox.textContent = explanations[step];
        }

        // Hacer clickable el siguiente
        const nextFactor = document.querySelector(`.factor[data-step="${step + 1}"]`);
        if (nextFactor) {
            nextFactor.classList.add('clickable');
        } else {
            // Fin de la cascada, mostrar epílogo
            setTimeout(() => {
                 epilogue.style.display = 'block';
                 setTimeout(() => epilogue.style.opacity = '1', 10);
            }, 1000);
        }
    }

    // Event listener para los factores clickables
    document.getElementById('cascade-svg').addEventListener('click', function(e) {
        const targetFactor = e.target.closest('.factor.clickable');
        if (!targetFactor) return;

        const step = parseInt(targetFactor.dataset.step, 10);
        if (step === currentStep + 1) {
            currentStep = step;
            updateCascade(currentStep);
        }
    });

    // Inicialización del simulador
    function initialize() {
        // Activar Vía extrínseca por defecto
        document.getElementById('factor-3').classList.add('active');
        document.getElementById('factor-7').classList.add('active');
        
        // Hacer Factor XII clickable
        document.getElementById('factor-12').classList.add('clickable');
        explanationBox.textContent = explanations[2];
    }
    
    initialize();

    // Lógica para las preguntas del epílogo (reutilizada de feynman-logic.js)
    const mcqContainers = document.querySelectorAll('.interactive-simulator');
    mcqContainers.forEach(container => {
        const options = container.querySelectorAll('.mcq-option');
        const explanation = container.querySelector('.explanation');

        options.forEach(option => {
            option.addEventListener('click', function() {
                // Prevenir múltiples clics
                if (container.dataset.answered) return;
                container.dataset.answered = 'true';

                options.forEach(btn => btn.disabled = true);
                if (this.dataset.correct === 'true') {
                    this.classList.add('correct');
                } else {
                    this.classList.add('incorrect');
                    const correctOption = container.querySelector('[data-correct="true"]');
                    if (correctOption) correctOption.classList.add('correct');
                }
                if (explanation) explanation.style.display = 'block';
            });
        });
    });
});
