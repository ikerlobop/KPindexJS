// URL de la API de NOAA
const url = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json";

// Función para obtener los últimos 20 valores del índice Kp
async function obtenerUltimos20KP() {
    try {
        const response = await fetch(url);
        const kpData = await response.json();
        return kpData.slice(0, 20);
    } catch (error) {
        console.error("Error al obtener los datos del índice Kp:", error);
        return [];
    }
}

// Función para determinar el tipo de tormenta basado en el valor Kp y aplicar el estilo correspondiente
function determinarTipoTormenta(kpEstimated) {
    const tipoTormentaElem = document.getElementById("kpTormenta");
    
    // Eliminar todas las clases previas
    tipoTormentaElem.classList.remove("kp-alerta-leve", "kp-alerta-moderada", "kp-alerta-fuerte", "kp-alerta-extrema", "sin-tormenta");

    // Determinar y asignar la clase CSS correspondiente
    if (kpEstimated >= 8) {
        tipoTormentaElem.classList.add("kp-alerta-extrema");
        return "Tormenta extrema (G4/G5)";
    } else if (kpEstimated == 7) {
        tipoTormentaElem.classList.add("kp-alerta-fuerte");
        return "Tormenta fuerte (G3)";
    } else if (kpEstimated == 6) {
        tipoTormentaElem.classList.add("kp-alerta-moderada");
        return "Tormenta moderada (G2)";
    } else if (kpEstimated == 5) {
        tipoTormentaElem.classList.add("kp-alerta-leve");
        return "Tormenta leve (G1)";
    } else {
        tipoTormentaElem.classList.add("sin-tormenta");
        return "Sin tormenta geomagnética significativa";
    }
}

// Función para actualizar la tabla con los datos del índice Kp y mostrar el tipo de tormenta
async function actualizarTabla() {
    const kpData = await obtenerUltimos20KP();

    // Obtener el cuerpo de la tabla
    const tbody = document.querySelector("#kpTable tbody");
    tbody.innerHTML = '';

    // Insertar los datos en la tabla
    kpData.forEach(kp => {
        const fecha = new Date(kp.time_tag).toLocaleString();
        const kpEstimated = kp.estimated_kp;

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
            row.style.backgroundColor = "red";
            kpCell.style.color = "white";      
        } else {
            // Verde claro si es menor a 5
            row.style.backgroundColor = "lightgreen"; 
        }
    });

    // Mostrar el tipo de tormenta para el último valor
    const ultimoKP = kpData[19].estimated_kp;  // Último valor de Kp (el más reciente)
    const tipoTormenta = determinarTipoTormenta(ultimoKP);

    // Actualizar el valor del índice Kp y el tipo de tormenta en el HTML
    document.getElementById("kpValor").textContent = ultimoKP;
    document.getElementById("kpTormenta").textContent = tipoTormenta;
}

const barraCell = document.createElement("td");
const contenedorBarra = document.createElement("div");
contenedorBarra.classList.add("kp-bar-container");

const barra = document.createElement("div");
barra.classList.add("barra-kp", `kp${Math.floor(kpEstimated)}`); // clase dinámica
barra.style.width = `${(kpEstimated / 9) * 100}%`;

contenedorBarra.appendChild(barra);
barraCell.appendChild(contenedorBarra);

// Añadir la nueva celda al final de la fila
row.appendChild(barraCell);


// Actualizar la tabla cada 60 segundos
actualizarTabla();
setInterval(actualizarTabla, 60000);  
