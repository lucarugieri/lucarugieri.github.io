
const dashboardContainer = document.getElementById("dashboard");
const covate = JSON.parse(localStorage.getItem("covate")) || [];
const pulcini = JSON.parse(localStorage.getItem("pulcini")) || [];

function render() {
  renderDashboard();
}

function renderDashboard() {
  dashboardContainer.innerHTML = "";
  covate.forEach((covata, index) => {
    const container = document.createElement("div");
    container.className = "dashboard-entry";

    // Info covata
    const info = document.createElement("div");
    info.className = "dashboard-info";
    const pulciniCovata = pulcini.filter(p => p.covata === covata.nome);
    const nati = pulciniCovata.length;
    const hatchRate = covata.uovaTotali > 0 ? Math.round((nati / covata.uovaTotali) * 100) : 0;

    info.innerHTML = `
      <h3>${covata.nome}</h3>
      <p><strong>Uova Totali:</strong> ${covata.uovaTotali}</p>
      <p><strong>Pulcini Nati:</strong> ${nati}</p>
      <p><strong>Hatch Rate:</strong> ${hatchRate}%</p>
    `;

    // Canvas
    const canvas = document.createElement("canvas");
    canvas.id = "chart_" + index;

    // Appendi tutto
    container.appendChild(info);
    container.appendChild(canvas);
    dashboardContainer.appendChild(container);

    // Distribuzione sesso
    const sessoCount = { Maschio: 0, Femmina: 0, Incerto: 0 };
    pulciniCovata.forEach(p => {
      if (p.sesso === "Maschio") sessoCount.Maschio++;
      else if (p.sesso === "Femmina") sessoCount.Femmina++;
      else sessoCount.Incerto++;
    });

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(sessoCount),
        datasets: [{
          data: Object.values(sessoCount),
          backgroundColor: ["#4caf50", "#f06292", "#ffca28"]
        }]
      },
      options: {
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  });
}

render();
