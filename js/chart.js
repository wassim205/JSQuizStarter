export function barChart(history) {
  const themeCounts = history.reduce((acc, game) => {
    const theme = game.theme || "Non spécifié";
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});

  // Extract labels and counts arrays
  const themeLabels = Object.keys(themeCounts);
  const themePlayCounts = Object.values(themeCounts);

  const ctx = document.getElementById("stats-bar-charts");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: themeLabels,
      datasets: [
        {
          label: "Nombre de parties jouées",
          data: themePlayCounts,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}


export function lineChart(history) {
     const ctx = document.getElementById("stats-line-charts");

  new Chart(ctx, {
    type: "line",
      data: {
      labels: history.map((game, index) => `Partie ${index + 1}`),
      datasets: [
        {
          label: "Progression du score",
          data: history.map((game) => {
            const [correct, total] = game.score.split("/").map(Number);
            return ((correct / total) * 100).toFixed(2); // Convert to percentage
          }),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          borderWidth: 1,
        },
      ],
    },
      options: {
        responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}