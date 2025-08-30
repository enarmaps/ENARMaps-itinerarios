// --- INICIALIZADOR PRINCIPAL ---
// Se ejecuta cuando la página ha cargado por completo.
document.addEventListener('DOMContentLoaded', function () {
    // Llama a cada una de las funciones de configuración.
    setupSceneReveal();
    setupDragAndDrop();
    setupECGSimulator();
    setupModuleLeadCapture();
});


// --- MÓDULO 1: REVELAR ESCENAS SECUENCIALES ---
function setupSceneReveal() {
    // La función se hace global para que el `onclick` del HTML la pueda encontrar.
    window.revealScene = function(sceneId) {
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.style.display = 'block';
            setTimeout(() => {
                scene.style.opacity = '1';
                scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 10);
        }
    }
}


// --- Función para la lógica de Drag and Drop (MEJORADA) ---
function setupDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const dragOptionsContainer = document.getElementById('drag-options');
    const resetButton = document.getElementById('reset-drag-button'); // << Obtener referencia al botón
    if (!dragItems.length || !dropZones.length) return;

    let draggedItem = null;

    dragItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedItem = e.target;
            setTimeout(() => { if (e.target) e.target.style.opacity = '0.5'; }, 0);
        });
        item.addEventListener('dragend', function(e) {
            setTimeout(() => { if (e.target) e.target.style.opacity = '1'; draggedItem = null; }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => { zone.classList.remove('dragover'); });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (draggedItem && this.dataset.target === draggedItem.dataset.target && !this.querySelector('.drag-item')) {
                // Acción si el drop es CORRECTO
                this.appendChild(draggedItem);
                draggedItem.style.backgroundColor = 'var(--color-success)'; // Color verde de éxito
                draggedItem.setAttribute('draggable', 'false');
            } else if (draggedItem) {
                // << NUEVO: Acción si el drop es INCORRECTO
                draggedItem.style.backgroundColor = 'var(--color-error)'; // Color rojo de error
                // Devuelve el color original después de un momento
                setTimeout(() => {
                    if (draggedItem) {
                       draggedItem.style.backgroundColor = 'var(--color-primary-dark)';
                    }
                }, 500);
            }
        });
    });

    // << NUEVO: Lógica para el botón de reiniciar
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Devuelve todos los items a su contenedor original
            dragItems.forEach(item => {
                if (dragOptionsContainer) dragOptionsContainer.appendChild(item);
                // Restablece los estilos y la capacidad de ser arrastrado
                item.style.backgroundColor = 'var(--color-primary-dark)';
                item.setAttribute('draggable', 'true');
            });
            // Limpia el texto de las zonas de drop (si lo hubiéramos modificado)
            dropZones.forEach(zone => {
                // (Opcional) Si en el futuro pusiéramos texto dentro de la zona
            });
        });
    }
}


// --- MÓDULO 3: SIMULADOR DE ECG ANIMADO ---
function setupECGSimulator() {
    const canvas = document.getElementById('ecg-canvas');
    if (!canvas) return; // Si no hay canvas de ECG en la página, no hace nada.

    const ctx = canvas.getContext('2d');
    const descriptionBox = document.getElementById('ecg-description');
    const hotspots = document.querySelectorAll('.hotspot');
    const resetButton = document.getElementById('reset-ecg-button'); 
    let audioCtx;

    function playBeep() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    const ecgPatterns = {
        'normal': { desc: 'Ritmo Sinusal Normal. El viaje del impulso es exitoso y ordenado.', pr: 0.16, qrs: 0.08, rate: 75 },
        'bav1': { desc: 'Bloqueo AV de 1er Grado: El "guardia" (Nodo AV) retrasa a todos por igual. El intervalo PR está prolongado (>0.20s).', pr: 0.28, qrs: 0.08, rate: 75 },
        'brd': { desc: 'Bloqueo de Rama Derecha: La "superautopista" derecha está cerrada. El QRS es ancho (>0.12s) y se ve un patrón RSR\' en V1.', pr: 0.16, qrs: 0.14, rate: 75 },
        'bri': { desc: 'Bloqueo de Rama Izquierda: La "superautopista" izquierda está cerrada. El QRS es ancho (>0.12s) con R ancha en derivaciones laterales.', pr: 0.16, qrs: 0.14, rate: 75 },
        'hbai': { desc: 'Hemibloqueo Anterior Izquierdo: El impulso se desvía, causando una desviación del eje eléctrico a la izquierda.', pr: 0.16, qrs: 0.09, rate: 75 },
        'hbpi': { desc: 'Hemibloqueo Posterior Izquierdo: El impulso se desvía, causando una desviación del eje eléctrico a la derecha.', pr: 0.16, qrs: 0.09, rate: 75 },
        'mobitz1': { desc: 'Mobitz I (Wenckebach): El "guardia" se cansa. El PR se alarga progresivamente hasta que un latido se bloquea.', pr: 0.16, qrs: 0.08, rate: 75, pattern: 'Mobitz1' },
        'mobitz2': { desc: 'Mobitz II: El "guardia" es impredecible. El PR es constante, pero algunos latidos se bloquean súbitamente (ej. 3:2).', pr: 0.16, qrs: 0.08, rate: 75, pattern: 'Mobitz2' },
        'bav3': { desc: 'Bloqueo AV de 3er Grado: Disociación completa. Las aurículas (Ondas P) y los ventrículos (QRS) laten cada uno a su propio ritmo.', pr: 0, qrs: 0.16, rate: 40, pattern: 'BAV3' }
    };

    let animationFrameId;
    function drawGrid() {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const squareSize = 10; // Tamaño en píxeles de un cuadro pequeño (1mm)

        ctx.beginPath();
        ctx.strokeStyle = '#2c3e50'; // Color oscuro para la cuadrícula
        ctx.lineWidth = 0.5; // Líneas delgadas

        // Líneas verticales
        for (let x = 0; x <= canvasWidth; x += squareSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        // Líneas horizontales
        for (let y = 0; y <= canvasHeight; y += squareSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();

        // Cuadrícula más gruesa (cada 5 cuadros)
        ctx.beginPath();
        ctx.strokeStyle = '#34495e'; // Un poco más visible
        ctx.lineWidth = 1;

        // Líneas verticales gruesas
        for (let x = 0; x <= canvasWidth; x += (squareSize * 5)) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        // Líneas horizontales gruesas
        for (let y = 0; y <= canvasHeight; y += (squareSize * 5)) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();
    }

   
    function startECGAnimation(pattern) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        let { desc, pr, qrs, rate, pattern: blockPattern } = pattern;
        descriptionBox.textContent = desc;

        const canvasWidth = canvas.width = canvas.clientWidth;
        const canvasHeight = canvas.height = canvas.clientHeight;
        const centerY = canvasHeight / 2;
        const amplitude = canvasHeight / 3.5; // Ajustamos la amplitud para que no se salga
        const speed = 1.5; // Velocidad del trazado en píxeles por frame
        const samplingRate = 0.02; // Cuántos segundos avanza el tiempo en cada frame

        const tracePoints = []; // Array para guardar los puntos de la línea Y
        let time = 0; // Tiempo global del ECG en segundos
        
        // Inicializa el trazo con puntos planos para evitar un "salto" al inicio
        for (let i = 0; i < canvasWidth / speed; i++) {
            tracePoints.push(centerY);
        }

        function draw() {
            // 1. Limpiar y dibujar fondo
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawGrid();

            // 2. Calcular la nueva posición Y para el punto actual
            const vBeatDuration = 60 / rate; // Duración de un latido ventricular
            const pBeatDuration = 60 / 75; // Duración de un latido auricular (para P en BAV3)
            
            let y = centerY; // Posición Y predeterminada (línea plana)
            let currentPR = pr; // Intervalo PR actual
            let drawQRSAndT = true; // Flag para dibujar QRS y T

            const globalTime = time; // El tiempo actual en segundos
            const beatTime = globalTime % vBeatDuration; // Tiempo dentro del ciclo de latido actual
            const currentBeat = Math.floor(globalTime / vBeatDuration); // Número de latido
            
            // --- Lógica de Bloqueos (afecta drawQRSAndT y currentPR) ---
            if (blockPattern === 'Mobitz1') {
                const sequence = currentBeat % 4; // Por ejemplo, un ciclo de 4 latidos
                if (sequence === 3) drawQRSAndT = false; // Bloquea el 4to latido (3:2)
                currentPR = pr + (sequence * 0.07); // PR se alarga progresivamente
            }
            if (blockPattern === 'Mobitz2') {
                if (currentBeat % 3 === 2) drawQRSAndT = false; // Bloquea el 3er latido (3:2)
            }

            // --- Lógica de Dibujo de Ondas (calcula la 'y' del punto actual) ---
            if (blockPattern === 'BAV3') {
                // Onda P (independiente del QRS)
                const pTimeInBeat = globalTime % pBeatDuration;
                if (pTimeInBeat < 0.12) y -= Math.sin((pTimeInBeat / 0.12) * Math.PI) * (amplitude * 0.15);
                
                // QRS (independiente de la P)
                const qrsTimeInBeat = globalTime % vBeatDuration;
                if (qrsTimeInBeat < qrs) {
                     const progress = qrsTimeInBeat / qrs;
                     y -= Math.sin(progress * Math.PI) * (amplitude * (progress < 0.5 ? -0.5 : 1));
                     // Beep
                     if (progress > 0.45 && progress < 0.55 && !draw.beeped) { playBeep(); draw.beeped = true; } 
                     else if (progress < 0.45 || progress > 0.55) { draw.beeped = false; }
                }
            } else { // Para todos los demás ritmos (Normal, BAV1, Bloqueos de Rama, Hemibloqueos, Mobitz)
                // Onda P
                if (beatTime < 0.12) { // La Onda P ocurre en los primeros 0.12s del beat
                    y -= Math.sin((beatTime / 0.12) * Math.PI) * (amplitude * 0.15);
                }
                
                if (drawQRSAndT) { // Si el latido no está bloqueado (Mobitz)
                    // QRS
                    if (beatTime >= currentPR && beatTime < currentPR + qrs) {
                        const progress = (beatTime - currentPR) / qrs; // Progreso dentro del QRS
                        y -= Math.sin(progress * Math.PI) * (amplitude * (progress < 0.5 ? -0.5 : 1));
                        // Beep
                        if (progress > 0.45 && progress < 0.55 && !draw.beeped) { playBeep(); draw.beeped = true; } 
                        else if (progress < 0.45 || progress > 0.55) { draw.beeped = false; }
                    }
                    // Onda T (después del QRS)
                    const timeAfterQRS = beatTime - currentPR - qrs;
                    if (timeAfterQRS > 0.1 && timeAfterQRS < 0.4) {
                        y -= Math.sin(((timeAfterQRS - 0.1) / 0.3) * Math.PI) * (amplitude * 0.3);
                    }
                }
            }
            
            // 3. Añadir el nuevo punto Y al final de la traza
            tracePoints.push(y);
            // Si la traza es más larga que el ancho del canvas, elimina el punto más antiguo
            if (tracePoints.length * speed > canvasWidth) {
                tracePoints.shift();
            }

            // 4. Dibujar la línea completa uniendo todos los puntos en el array
            ctx.beginPath();
            ctx.moveTo(0, tracePoints[0]); // Empieza desde el primer punto
            for (let i = 1; i < tracePoints.length; i++) {
                ctx.lineTo(i * speed, tracePoints[i]); // Conecta al siguiente punto
            }
            ctx.strokeStyle = '#33ff99'; // Color del trazo ECG
            ctx.lineWidth = 2.5;
            ctx.stroke();

            time += samplingRate; // Avanza el tiempo global
            animationFrameId = requestAnimationFrame(draw); // Solicita el siguiente frame
        }

        draw.beeped = false; // Reinicia el flag del beep al iniciar una nueva animación
        draw(); // Inicia el primer frame del dibujo
    }

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            const blockType = this.dataset.block;
            if (ecgPatterns[blockType]) {
                startECGAnimation(ecgPatterns[blockType]);
            }
        });
    });
    resetButton.addEventListener('click', function() {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        startECGAnimation(ecgPatterns.normal);
    });   
    startECGAnimation(ecgPatterns.normal); // Iniciar con el ritmo normal
}

// --- MÓDULO 4: CAPTURA DE CORREOS ---
function setupModuleLeadCapture() {
    const WEBHOOK_URL = 'https://hook.us2.make.com/jokd7c90xlvtq0eypw77wqk2n9386vbn';
    const moduleForm = document.querySelector('.lead-form-interno');

    if (moduleForm) {
        moduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Procesando...';

            const formData = {
                nombre: form.querySelector('input[name="nombre"]').value,
                email: form.querySelector('input[name="email"]').value,
                whatsapp: form.querySelector('input[name="whatsapp"]').value,
                source: document.title
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if(response.ok) {
                    window.open('/webapp/boveda.html', '_blank');
                    form.innerHTML = '<p style="font-size: 1.2rem; color: white; font-weight: 600;">¡Éxito! La Bóveda se ha abierto en una nueva pestaña.</p>';
                } else { throw new Error('Error en el webhook.'); }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema. Intenta de nuevo.');
                submitButton.disabled = false;
                submitButton.textContent = 'Acceder a la Bóveda Gratuita';
            });
        });
    }
}

// --- FUNCIÓN AÑADIDA PARA MANEJAR QUIZZES DE OPCIÓN MÚLTIPLE ---
function setupMCQ() {
    const questions = document.querySelectorAll('.interactive-simulator');
    if (!questions.length) return;

    questions.forEach(question => {
        const options = question.querySelectorAll('.mcq-option');

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (question.dataset.answered) return;
                question.dataset.answered = 'true';

                const explanation = question.querySelector('.explanation');
                options.forEach(btn => btn.disabled = true);

                if (this.dataset.correct === 'true') {
                    this.classList.add('correct');
                } else {
                    this.classList.add('incorrect');
                    const correctOption = question.querySelector('[data-correct="true"]');
                    if (correctOption) correctOption.classList.add('correct');
                }

                if (explanation) explanation.style.display = 'block';
            });
        });
    });
}

// --- CÓDIGO EXISTENTE (MODIFICADO PARA LLAMAR A LA NUEVA FUNCIÓN) ---
document.addEventListener('DOMContentLoaded', function () {
    setupSceneReveal();
    setupDragAndDrop();
    setupMCQ(); // <-- Añade esta línea para activar la lógica del quiz
    setupModuleLeadCapture();
});











