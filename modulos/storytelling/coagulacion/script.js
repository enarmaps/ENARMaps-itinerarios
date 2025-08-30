document.addEventListener('DOMContentLoaded', function() {
    const factors = document.querySelectorAll('.factor');
    const arrows = document.querySelectorAll('.arrow');
    const explanationBox = document.getElementById('explanation-box');
    const epilogue = document.getElementById('epilogue');
    const resetButton = document.getElementById('reset-cascade-btn');

    let currentStep = 1;

    const explanations = {
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
        const currentFactor = document.querySelector(`.factor[data-step="${step}"]`);
        if (currentFactor) {
            currentFactor.classList.add('active');
            currentFactor.classList.remove('clickable');
        }

        let previousArrow;
        if (step === 3) previousArrow = document.getElementById('arrow-12-11');
        if (step === 4) previousArrow = document.getElementById('arrow-11-9');
        if (step === 5) {
            previousArrow = document.getElementById('arrow-9-10');
            document.getElementById('arrow-7-10')?.classList.add('active');
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

        if (explanations[step]) {
            explanationBox.textContent = explanations[step];
        }

        const nextFactor = document.querySelector(`.factor[data-step="${step + 1}"]`);
        if (nextFactor) {
            nextFactor.classList.add('clickable');
        } else {
            setTimeout(() => {
                 epilogue.style.display = 'block';
                 setTimeout(() => epilogue.style.opacity = '1', 10);
            }, 1000);
        }
    }

    document.getElementById('cascade-svg').addEventListener('click', function(e) {
        const targetFactor = e.target.closest('.factor.clickable');
        if (!targetFactor) return;

        const step = parseInt(targetFactor.dataset.step, 10);
        if (step === currentStep + 1) {
            currentStep = step;
            updateCascade(currentStep);
        }
    });
    
    function resetCascade() {
        currentStep = 1;
        
        factors.forEach(factor => {
            factor.classList.remove('active', 'clickable');
        });
        arrows.forEach(arrow => {
            arrow.classList.remove('active');
        });

        document.getElementById('factor-3').classList.add('active');
        document.getElementById('factor-7').classList.add('active');
        document.getElementById('factor-12').classList.add('clickable');
        
        epilogue.style.opacity = '0';
        setTimeout(() => epilogue.style.display = 'none', 300);

        explanationBox.textContent = explanations[2];
        
        document.querySelectorAll('.interactive-simulator').forEach(q => {
            q.removeAttribute('data-answered');
            q.querySelectorAll('.mcq-option').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'incorrect');
            });
            q.querySelector('.explanation').style.display = 'none';
        });
    }

    resetButton.addEventListener('click', resetCascade);
    
    resetCascade(); // Llamar para el estado inicial
});
