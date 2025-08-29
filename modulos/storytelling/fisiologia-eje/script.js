// =================================================================== //
// JS Final y Completo para "El Viaje del Impulso Eléctrico"           //
// =================================================================== //
document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA PARA REVELAR ESCENAS ---
    // Esta función es llamada por los botones "onclick" en el HTML
    window.revealScene = function(sceneId) {
        const scene = document.getElementById(sceneId);
        if (scene) {
            scene.style.display = 'block';
            // Pequeño delay para que el navegador renderice el display:block antes de la animación de opacidad
            setTimeout(() => {
                scene.style.opacity = '1';
                scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 10);
        }
    }
});
