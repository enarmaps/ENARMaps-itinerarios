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


// --- MÓDULO 2: LÓGICA DE DRAG AND DROP ---
function setupDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    if (!dragItems.length || !dropZones.length) return; // Si no hay elementos, no hace nada.

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
        zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('hovered'); });
        zone.addEventListener('dragleave', () => { zone.classList.remove('hovered'); });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('hovered');
            if (draggedItem && this.dataset.target === draggedItem.dataset.target && !this.querySelector('.drag-item')) {
                this.appendChild(draggedItem);
                draggedItem.classList.add('correct');
                draggedItem.setAttribute('draggable', 'false');
            } else if (draggedItem) {
                draggedItem.classList.add('incorrect');
                setTimeout(() => { draggedItem.classList.remove('incorrect'); }, 500);
            }
        });
    });
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

    let animationFrameId;

    function startECGAnimation(pattern) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        let { desc, pr, qrs, rate, pattern: blockPattern } = pattern;
        descriptionBox.textContent = desc;

        const canvasWidth = canvas.width = canvas.clientWidth;
        const canvasHeight = canvas.height = canvas.clientHeight;
        const centerY = canvasHeight / 2;
        const amplitude = canvasHeight / 3;
        
        let x = 0;
        let pTime = 0;
        let qrsTime = 0;
        const pRate = 75; // Frecuencia auricular constante para BAV3
        const pBeatDuration = 60 / pRate;
        const vBeatDuration = 60 / rate;
        
        let beatCount = 0;

        function draw() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 1. Limpia todo el canvas
            drawGrid(); // 2. Dibuja la cuadrícula en cada frame

            x = (x + 2) % canvasWidth; // La línea avanza y se reinicia
            
            let y = centerY;
            
            // Lógica de dibujo
            let currentPR = pr;
            let pVisible = false;
            let qrsAndTVisible = true;

            if (blockPattern === 'BAV3') {
                pTime = globalTime % pBeatDuration;
                qrsTime = globalTime % vBeatDuration;
                if (pTime < 0.1) pVisible = true;
                if (qrsTime >= qrs) qrsAndTVisible = false; 
            } else {
                let beatTime = globalTime % vBeatDuration;
                let currentBeat = Math.floor(globalTime / vBeatDuration);
                pTime = beatTime;

                if (beatTime < 0.1) pVisible = true;
                qrsVisible = true;

                if (blockPattern === 'Mobitz1') {
                    const sequence = currentBeat % 4; // Secuencia 3:2
                    if (sequence === 3) qrsVisible = false;
                    currentPR = pr + (sequence * 0.07);
                }
                if (blockPattern === 'Mobitz2') {
                    if (currentBeat % 3 === 2) qrsVisible = false; // Secuencia 3:2
                }
                if (qrsVisible && beatTime >= currentPR && beatTime < currentPR + qrs) {
                    // QRS se dibuja
                } else {
                    qrsVisible = false;
                }
            }

            // Dibujar P
            if (pVisible) {
                y -= Math.sin((pTime / 0.1) * Math.PI) * (amplitude * 0.15);
            }
            // Dibujar QRS y Beep
            if (qrsVisible) {
                const timeInQRS = (blockPattern === 'BAV3') ? qrsTime : globalTime % vBeatDuration - currentPR;
                const progress = timeInQRS / qrs;
                y -= Math.sin(progress * Math.PI) * (amplitude * (progress < 0.5 ? -0.5 : 1));
                
                // Beep solo una vez por QRS
                if (progress > 0.45 && progress < 0.55) {
                    if (!this.beeped) {
                        playBeep();
                        this.beeped = true;
                    }
                } else {
                    this.beeped = false;
                }
            }
            // Dibujar T
            if(qrsAndTVisible){ // <-- CAMBIO 3: Usamos la nueva variable
                const timeAfterQRS = (blockPattern === 'BAV3') ? qrsTime - qrs : globalTime % vBeatDuration - currentPR - qrs;
                if(timeAfterQRS > 0.1 && timeAfterQRS < 0.4){
                     y -= Math.sin(((timeAfterQRS - 0.1) / 0.3) * Math.PI) * (amplitude * 0.3);
                }
            }

            ctx.beginPath();
            ctx.moveTo(x - 2, this.lastY || centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#33ff99';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            this.lastY = y;
            
            animationFrameId = requestAnimationFrame(draw);
        }
        draw();
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






