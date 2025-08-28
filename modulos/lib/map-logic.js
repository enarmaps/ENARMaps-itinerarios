/**
 * ENARMaps - Lógica de Renderizado del Mapa Mental
 * Versión: 2.0 (Robusta)
 * Descripción: Este script inicializa la librería Markmap para leer el contenido
 * de un mapa mental desde el HTML y lo renderiza en un elemento SVG.
 * Utiliza el método oficial de "transformar" y luego "crear" para máxima compatibilidad.
 */

// Se encapsula toda la lógica en una función autoejecutable para no contaminar el scope global.
(function() {
    
    // Espera a que todo el contenido del HTML (DOM) esté completamente cargado y listo.
    document.addEventListener('DOMContentLoaded', function() {

        // --- 1. REFERENCIAS A LOS ELEMENTOS DEL DOM ---
        
        // Busca el elemento <script> que contiene el texto de nuestro mapa mental.
        const markdownElement = document.getElementById('markdown-mapa');
        
        // Busca el elemento <svg> donde se va a dibujar el mapa mental.
        const svgElement = document.getElementById('markmap-svg');

        // --- Verificación de Seguridad ---
        // Si no se encuentra el contenedor del mapa o el SVG, se detiene la ejecución para evitar errores.
        if (!markdownElement || !svgElement) {
            console.error("Error: No se encontró el elemento 'markdown-mapa' o 'markmap-svg'. Asegúrate de que existan en tu HTML.");
            return;
        }

        // --- 2. ACCESO A LA LIBRERÍA MARKMAP ---

        // Las librerías que cargas desde el CDN (markmap-lib y markmap-view) se adjuntan al objeto 'window'.
        // Aquí las extraemos para usarlas de forma más limpia.
        const { Transformer } = window.markmap;
        const { Markmap } = window.markmap;

        // --- 3. LÓGICA DE RENDERIZADO ---

        try {
            // Prepara una instancia del transformador. Este es el "cerebro" que lee el markdown.
            const transformer = new Transformer();

            // Lee el contenido de texto del mapa. .textContent es la forma estándar y segura de hacerlo.
            const markdownContent = markdownElement.textContent;

            // Transforma el texto plano de markdown a una estructura de datos (JSON) que Markmap entiende.
            // Este es el paso clave que fallaba en tu implementación anterior con caracteres especiales.
            const { root, features } = transformer.transform(markdownContent);

            // Finalmente, crea el mapa mental visual dentro del SVG (#markmap-svg),
            // pasándole los datos ya transformados (root).
            Markmap.create(svgElement, undefined, root);

        } catch (error) {
            // Si algo falla durante el proceso, se mostrará un error detallado en la consola del navegador.
            console.error("Error al renderizar el mapa mental:", error);
        }
    });

})();
