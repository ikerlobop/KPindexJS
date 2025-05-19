const url = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json";
let chartInstance = null;

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

function determinarTipoTormenta(kpEstimated) {
    const tipoTormentaElem = document.getElementById("kpTormenta");
    tipoTormentaElem.classList.remove("kp-alerta-leve", "kp-alerta-moderada", "kp-alerta-fuerte", "kp-alerta-extrema", "sin-tormenta");

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

function renderizarGrafico(kpData) {
    const ctx = document.getElementById("kpChart").getContext("2d");

    const labels = kpData.map(kp => new Date(kp.time_tag).toLocaleString()).reverse();
    const valores = kpData.map(kp => kp.estimated_kp).reverse();
    const colores = valores.map(v => {
        if (v >= 8) return "#D32F2F";
        if (v === 7) return "#F44336";
        if (v === 6) return "#FF9800";
        if (v === 5) return "#FFEB3B";
        return "#4CAF50";
    });

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Índice Kp',
                data: valores,
                backgroundColor: colores
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `Kp: ${ctx.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 9,
                    title: { display: true, text: "Valor Kp" }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }
            }
        }
    });
}

async function actualizarTabla() {
    const kpData = await obtenerUltimos20KP();
    const tbody = document.querySelector("#kpTable tbody");
    tbody.innerHTML = '';

    kpData.forEach(kp => {
        const fecha = new Date(kp.time_tag).toLocaleString();
        const kpEstimated = kp.estimated_kp;

        const row = document.createElement("tr");

        const fechaCell = document.createElement("td");
        fechaCell.textContent = fecha;

        const kpCell = document.createElement("td");
        kpCell.textContent = kpEstimated;

        row.appendChild(fechaCell);
        row.appendChild(kpCell);

        tbody.appendChild(row);

        fechaCell.style.textAlign = "center";
        kpCell.style.textAlign = "center";

        if (kpEstimated >= 5) {
            row.style.backgroundColor = "red";
            kpCell.style.color = "white";
        } else {
            row.style.backgroundColor = "lightgreen";
        }
    });

    const ultimoKP = kpData[19].estimated_kp;
    const tipoTormenta = determinarTipoTormenta(ultimoKP);
    document.getElementById("kpValor").textContent = ultimoKP;
    document.getElementById("kpTormenta").textContent = tipoTormenta;

    renderizarGrafico(kpData);
}

actualizarTabla();
setInterval(actualizarTabla, 60000);
