
// URL de la API de NOAA para el índice Kp
const url = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json";

// Función para obtener los últimos 20 valores del índice Kp
async function obtenerUltimos20KP() {
    try {
        const response = await fetch(url);
        const kpData = await response.json();
        return kpData.slice(0, 20);  // Tomamos solo los últimos 20
    } catch (error) {
        console.error("Error al obtener los datos del índice Kp:", error);
        return [];
    }
}

// Función para actualizar la tabla con los datos del índice Kp
async function actualizarTabla() {
    const kpData = await obtenerUltimos20KP();

    // Obtener el cuerpo de la tabla
    const tbody = document.querySelector("#kpTable tbody");
    tbody.innerHTML = '';  // Limpiar la tabla antes de insertar los datos nuevos

    // Insertar los datos en la tabla
    kpData.forEach(kp => {
        const fecha = new Date(kp.time_tag).toLocaleString();  // Formatear la fecha
        const kpEstimated = kp.estimated_kp;  // Índice Kp estimado

        // Crear una nueva fila para la tabla
        const row = document.createElement("tr");

        // Crear las celdas
        const fechaCell = document.createElement("td");
        fechaCell.textContent = fecha;
        const kpCell = document.createElement("td");
        kpCell.textContent = kpEstimated;

        // Añadir las celdas a la fila
        row.appendChild(fechaCell);
        row.appendChild(kpCell);

        // Añadir la fila a la tabla
        tbody.appendChild(row);

        // Centrar texto en celdas
        fechaCell.style.textAlign = "center";
        kpCell.style.textAlign = "center";

        // Cambiar el color de la fila si el índice Kp es mayor o igual a 5
        if (kpEstimated >= 5) {
            row.style.kpcell.backgroundColor = "red"; 
        }
        else {
            //verde claro si es menor a 5
            row.style.backgroundColor = "lightgreen"; 
        }
    }
    );
}

// Actualizar la tabla inicialmente y cada 60 segundos
actualizarTabla();
setInterval(actualizarTabla, 60000);  // Actualizar cada 60 segundos
