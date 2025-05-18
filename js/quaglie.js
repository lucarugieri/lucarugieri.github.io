
const dashboardContainer = document.getElementById("dashboard");
const pulciniContainer = document.getElementById("pulcini");
const registroPulciniDiv = document.createElement("div");
registroPulciniDiv.id = "registroPulcini";
registroPulciniDiv.style.display = "none";
pulciniContainer.after(registroPulciniDiv);

const covate = JSON.parse(localStorage.getItem("covate")) || [];
const pulcini = JSON.parse(localStorage.getItem("pulcini")) || [];

function render() {
  renderDashboard();
  renderPulsanteRegistro();
}

function renderPulsanteRegistro() {
  pulciniContainer.innerHTML = "";
  const btn = document.createElement("button");
  btn.textContent = "🐣 Pulcini Attivi";
  btn.onclick = () => {
    registroPulciniDiv.style.display = registroPulciniDiv.style.display === "none" ? "block" : "none";
    renderRegistroPulcini();
  };
  pulciniContainer.appendChild(btn);
}

function renderRegistroPulcini() {
  registroPulciniDiv.innerHTML = "";
  const gruppi = {};

  pulcini.forEach(p => {
    if (!gruppi[p.covata]) gruppi[p.covata] = [];
    gruppi[p.covata].push(p);
  });

  Object.keys(gruppi).forEach(covata => {
    const section = document.createElement("div");
    section.className = "covata";
    const h3 = document.createElement("h3");
    h3.textContent = `Covata ${covata}`;
    section.appendChild(h3);

    gruppi[covata].forEach(p => {
      const eta = calcolaEta(p.dataNascita);
      const el = document.createElement("p");
      el.textContent = `• ${p.nome} (${p.sesso} - ${eta} giorni)`;
      section.appendChild(el);
    });

    registroPulciniDiv.appendChild(section);
  });
}

function renderDashboard() {
  dashboardContainer.innerHTML = "";
  covate.forEach((covata, index) => {
    const container = document.createElement("div");
    container.className = "dashboard-entry";

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

    const canvas = document.createElement("canvas");
    canvas.id = "chart_" + index;

    container.appendChild(info);
    container.appendChild(canvas);
    dashboardContainer.appendChild(container);

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

function calcolaEta(dataNascita) {
  const oggi = new Date();
  const nascita = new Date(dataNascita);
  const diff = oggi - nascita;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

render();
