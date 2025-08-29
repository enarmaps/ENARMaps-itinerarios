// JS Específico para el Módulo Feynman "Frank-Starling"
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('preload-slider');
    const valueDisplay = document.getElementById('preload-value');
    const canvas = document.getElementById('contractionChart');
    if (!slider || !valueDisplay || !canvas) { return; }

    const ctx = canvas.getContext('2d');
    let chart;

    function createOrUpdateChart(preload) {
        // Fórmula de una parábola invertida para simular la curva de Frank-Starling
        const force = -0.01 * Math.pow(preload - 90, 2) + 100;
        
        if (chart) {
            chart.data.datasets[0].data[0] = Math.max(0, force);
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Fuerza de Contracción'],
                    datasets: [{
                        label: 'Fuerza',
                        data: [Math.max(0, force)],
                        backgroundColor: 'rgba(26, 90, 150, 0.8)',
                        borderColor: 'rgba(13, 27, 78, 1)',
                        borderWidth: 2,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 110,
                            title: {
                                display: true,
                                text: 'Fuerza Relativa (%)'
                            }
                        },
                        x: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
        createOrUpdateChart(parseInt(this.value));
    });

    // Inicializa el gráfico con el valor por defecto del slider
    createOrUpdateChart(parseInt(slider.value));
});
