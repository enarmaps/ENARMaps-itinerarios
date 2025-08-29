document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('actionPotentialChart');
    if (!ctx) return;

    let chart;
    // Puntos de datos y tiempo más precisos fisiológicamente
    const baseLabels = [0, 5, 20, 200, 300, 350]; 
    const baseDataPoints = [-90, 20, 10, 10, -80, -90];
    
    const getBaseData = () => ({
        labels: [...baseLabels],
        datasets: [{
            label: 'Potencial de Membrana (mV)',
            data: [...baseDataPoints],
            borderColor: 'var(--color-primary-dark)',
            borderWidth: 4,
            fill: false,
            tension: 0.4,
            pointRadius: 0
        }]
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { min: -100, max: 40, title: { display: true, text: 'Potencial (mV)' } },
            x: { type: 'linear', min: -10, max: 500, title: { display: true, text: 'Tiempo (ms)' } }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 400 }
    };

    function createChart() {
        if (chart) { chart.destroy(); }
        chart = new Chart(ctx, { type: 'line', data: getBaseData(), options: options });
    }
    
    createChart();

    const btnBlockNa = document.getElementById('block-na');
    const btnBlockCa = document.getElementById('block-ca');
    const btnBlockK = document.getElementById('block-k');
    const btnReset = document.getElementById('reset-button');
    const allButtons = [btnBlockNa, btnBlockCa, btnBlockK];

    function setActiveButton(activeBtn) {
        allButtons.forEach(btn => { if(btn) btn.classList.remove('active'); });
        if (activeBtn) activeBtn.classList.add('active');
    }

    btnBlockNa.addEventListener('click', () => {
        setActiveButton(btnBlockNa);
        const newData = getBaseData();
        newData.datasets[0].data[1] = -65; // Fase 0 se aplana
        newData.datasets[0].data[2] = -70;
        newData.datasets[0].data[3] = -70;
        chart.data = newData;
        chart.update();
    });

    btnBlockCa.addEventListener('click', () => {
        setActiveButton(btnBlockCa);
        const newData = getBaseData();
        newData.datasets[0].data[3] = -50; // La meseta (Fase 2) se acorta y cae rápido
        chart.data = newData;
        chart.update();
    });

    btnBlockK.addEventListener('click', () => {
        setActiveButton(btnBlockK);
        const newData = getBaseData();
        newData.labels = [0, 5, 20, 200, 450, 500]; // El tiempo de repolarización se alarga
        chart.data = newData;
        chart.update();
    });

    btnReset.addEventListener('click', () => {
        setActiveButton(null);
        chart.data = getBaseData();
        chart.update();
    });
});
