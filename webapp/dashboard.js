// Espera a que todo el contenido de la página se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDeCliente();
});

// Función principal para obtener y mostrar los datos del cliente.
async function cargarDatosDeCliente() {
    // --- 1. Obtener el ID del Cliente desde la URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    // Si no hay 'id' en la URL, mostrar un error y detener la ejecución.
    if (!clienteId) {
        console.error("Error: No se proporcionó un ID de cliente en la URL.");
        // Aquí podrías mostrar un mensaje de error en la página.
        document.body.innerHTML = "<h1>Error: Acceso no válido. Por favor, use el enlace que recibió por correo.</h1>";
        return;
    }

    // --- 2. Construir la ruta al archivo JSON ---
    // Asumimos que el dashboard.html está en /cliente/ y los datos en /cliente/data/
    const dataPath = `/cliente/data/${clienteId}.json`;

    // --- 3. Cargar los datos usando fetch ---
    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            // Maneja errores si el archivo no se encuentra (ej. ID incorrecto)
            throw new Error('No se pudo encontrar el archivo de datos del cliente.');
        }
        const data = await response.json();

        // --- 4. Mostrar los datos en la página (Actualizar el DOM) ---
        actualizarDashboard(data);

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        // Muestra un mensaje de error más amigable en la página.
        document.body.innerHTML = `<h1>Error: No pudimos cargar tu información.</h1><p>Por favor, verifica que tu enlace sea correcto o contacta a soporte si el problema persiste. ID buscado: ${clienteId}</p>`;
    }
}

// Función para tomar los datos y ponerlos en los elementos HTML.
function actualizarDashboard(data) {
    // Ejemplo para actualizar el nombre del cliente
    // Asegúrate de que en tu dashboard.html tengas un elemento con id="nombre-cliente"
    const elementoNombre = document.getElementById('nombre-cliente');
    if (elementoNombre) {
        elementoNombre.textContent = data.clienteInfo.nombre;
    }

    // Ejemplo para actualizar el progreso general
    // Asegúrate de tener un elemento con id="progreso-general"
    const elementoProgreso = document.getElementById('progreso-general');
    if (elementoProgreso) {
        elementoProgreso.textContent = `${data.clienteInfo.progresoGeneral}%`;
        // Aquí también podrías actualizar una barra de progreso, etc.
    }

    // Ejemplo para construir la lista del itinerario
    // Asegúrate de tener un <tbody> o un <div> con id="itinerario-container"
    const containerItinerario = document.getElementById('itinerario-container');
    if (containerItinerario) {
        // Limpiamos cualquier contenido de ejemplo que pueda haber
        containerItinerario.innerHTML = ''; 

        // Creamos una fila de tabla o un div por cada tema del itinerario
        data.itinerario.forEach(tema => {
            const temaElement = document.createElement('tr'); // O 'div' si no usas tablas
            temaElement.innerHTML = `
                <td>Semana ${tema.semana}</td>
                <td>${tema.temaPrincipal}</td>
                <td>${tema.metodologia}</td>
                <td><span class="status-${tema.estado}">${tema.estado.replace('_', ' ')}</span></td>
            `;
            containerItinerario.appendChild(temaElement);
        });
    }

    console.log("Dashboard actualizado con éxito.");

}
