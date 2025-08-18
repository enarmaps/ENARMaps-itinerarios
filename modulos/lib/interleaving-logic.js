// =================================================================== //
// LIBRERÍA DE LÓGICA PARA MÓDULOS INTERLEAVING (interleaving-logic.js) //
// =================================================================== //

// --- Función para la Lógica de Quizzes de Múltiple Opción (MCQ) ---
function setupInterleavingQuiz() {
    const questions = document.querySelectorAll('.question-block');
    if (!questions.length) return;

    let score = 0;
    let answeredQuestions = 0;

    questions.forEach(question => {
        const options = question.querySelectorAll('.mcq-option');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (question.dataset.answered) return;
                question.dataset.answered = 'true';
                answeredQuestions++;

                const explanation = question.querySelector('.explanation');
                options.forEach(btn => btn.disabled = true);

                if (this.dataset.correct === 'true') {
                    this.classList.add('correct');
                    score++;
                } else {
                    this.classList.add('incorrect');
                    const correctOption = question.querySelector('[data-correct="true"]');
                    if (correctOption) correctOption.classList.add('correct');
                }
                
                if (explanation) explanation.style.display = 'block';

                if (answeredQuestions === questions.length) {
                    showResults();
                }
            });
        });
    });

    function showResults() {
        const resultsContainer = document.getElementById('quiz-results');
        const scoreText = document.getElementById('score-text');
        
        if (resultsContainer && scoreText) {
            scoreText.textContent = `Has completado el ejercicio. Tu puntuación: ${score} de ${questions.length} correctas.`;
            resultsContainer.style.display = 'block';
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// --- Script Genérico para la Captura de Correos (Reutilizado) ---
function setupLeadCapture() {
    const leadForm = document.querySelector('.lead-form-interno');
    if (!leadForm) return;
    leadForm.addEventListener('submit', function(e) { /* ... (código de captura idéntico al otro archivo) ... */ });
}

// --- Inicializador que se ejecuta cuando la página carga ---
document.addEventListener('DOMContentLoaded', function () {
    setupInterleavingQuiz();
    setupLeadCapture(); // Usamos la misma lógica de captura
});