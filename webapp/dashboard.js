// Espera a que todo el contenido de la página se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDeCliente();
});

// Función principal para obtener y mostrar los datos del cliente.
async function cargarDatosDeCliente() {
    // --- 1. Obtener el ID del Cliente desde la URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (!clienteId) {
        document.body.innerHTML = "<h1>Error: Acceso no válido. Por favor, use el enlace que recibió por correo.</h1>";
        return;
    }

    // --- 2. Construir la ruta al archivo JSON COMPLETO del cliente ---
    const dataPath = `/cliente/data/${clienteId}.json`;

    // --- 3. Cargar los datos usando fetch ---
    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error('No se pudo encontrar el archivo de datos del cliente.');
        }
        const data = await response.json();

        // --- 4. Mostrar los datos en la página (Actualizar el DOM) ---
        actualizarDashboard(data);

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        document.body.innerHTML = `<h1>Error: No pudimos cargar tu información.</h1><p>Por favor, verifica que tu enlace sea correcto o contacta a soporte. ID buscado: ${clienteId}</p>`;
    }
}

// Función para tomar los datos, encontrar la misión de HOY y ponerlos en los elementos HTML.
function actualizarDashboard(data) {
    // --- Actualizar información general del cliente (sin cambios) ---
    const elementoNombre = document.getElementById('nombre-cliente');
    if (elementoNombre && data.clienteInfo) {
        elementoNombre.textContent = data.clienteInfo.nombre;
    }

    const elementoProgresoTexto = document.getElementById('progreso-general-texto');
    if (elementoProgresoTexto && data.clienteInfo) {
        elementoProgresoTexto.textContent = `${data.clienteInfo.progresoGeneral || 0}% de avance`;
    }

    const elementoProgresoBarra = document.getElementById('progreso-general-barra');
    if (elementoProgresoBarra && data.clienteInfo) {
        elementoProgresoBarra.style.width = `${data.clienteInfo.progresoGeneral || 0}%`;
    }

    // --- LÓGICA INTELIGENTE PARA ENCONTRAR LA MISIÓN DE HOY ---
    const containerItinerario = document.getElementById('itinerario-container');
    const tituloMision = document.querySelector('.mission-widget .widget-title');

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date();
    const hoyISO = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

    // Buscar en el itinerario detallado el día que coincida con la fecha de hoy
    const misionDeHoy = data.itinerarioDetallado.find(dia => dia.fecha === hoyISO);

    if (containerItinerario && tituloMision) {
        if (misionDeHoy) {
            // Si encontramos tareas para hoy, las mostramos
            tituloMision.innerHTML = `🎯 Tu Misión para Hoy: <strong>${misionDeHoy.especialidadDelDia}</strong>`;
            containerItinerario.innerHTML = ''; 
            misionDeHoy.tareas.forEach(tarea => {
                const tareaElement = document.createElement('tr');
                const prioridadBadge = `<span class="priority-badge priority-${tarea.prioridad.toLowerCase()}"></span>`;
                
                tareaElement.innerHTML = `
                    <td style="text-align: center;">${prioridadBadge}</td>
                    <td><strong>${tarea.tema}</strong></td>
                    <td>${tarea.accionSugerida}</td>
                    <td><span class="status-pendiente">Pendiente</span></td>
                `;
                containerItinerario.appendChild(tareaElement);
            });
        } else {
            // Si no hay tareas para hoy (ej. día de descanso o fuera del plan)
            tituloMision.innerHTML = `🎯 Tu Misión para Hoy`;
            containerItinerario.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">¡Felicidades! Hoy no tienes temas nuevos asignados. Es un buen día para un repaso ligero o para descansar.</td></tr>`;
        }
    }

    console.log(`Dashboard actualizado para la fecha: ${hoyISO}`);
    
   const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');

    if (clienteId) {
        // Activar enlace del footer del widget de Misión
        const enlaceFooterMision = document.getElementById('enlace-itinerario-completo');
        if (enlaceFooterMision) {
            enlaceFooterMision.href = `itinerario.html?id=${clienteId}`;
        }

        // Activar botón de "Ver Itinerario Completo"
        const enlaceBotonItinerario = document.getElementById('enlace-itinerario');
        if (enlaceBotonItinerario) {
            enlaceBotonItinerario.href = `itinerario.html?id=${clienteId}`;
        }

        // Activar botón de "Ir al Mapa de Progreso"
        const enlaceBotonMapa = document.getElementById('enlace-mapa-progreso');
        if (enlaceBotonMapa) {
            enlaceBotonMapa.href = `../mapa-progreso/temario.html?id=${clienteId}`;
        }
    }
    

}




