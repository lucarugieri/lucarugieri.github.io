
const dashboardContainer = document.getElementById("dashboard");
const covateContainer = document.getElementById("covate");
const pulciniContainer = document.getElementById("pulcini");
const registroPulciniDiv = document.createElement("div");
registroPulciniDiv.id = "registroPulcini";
registroPulciniDiv.style.display = "none";
pulciniContainer.after(registroPulciniDiv);

const adultiContainer = document.createElement("div");
adultiContainer.id = "adulti";
pulciniContainer.after(adultiContainer);

let covate = JSON.parse(localStorage.getItem("covate")) || [];
let pulcini = JSON.parse(localStorage.getItem("pulcini")) || [];

function render() {
  renderDashboard();
  renderCovate();
  renderPulsanteRegistro();
  renderAdulti();
}

function renderCovate() {
  covateContainer.innerHTML = "";
  covate.forEach((covata, index) => {
    const div = document.createElement("div");
    div.className = "covata";
    div.innerHTML = `
      <h3>Covata ${covata.nome}</h3>
      <p><strong>Data Inizio:</strong> ${covata.dataInizio}</p>
      <p><strong>Uova Totali:</strong> ${covata.uovaTotali}</p>
      <p><strong>Razze:</strong> ${covata.razze}</p>
      <button onclick="rimuoviCovata(${index})">Rimuovi</button>
      <hr/>
    `;
    covateContainer.appendChild(div);
  });
  localStorage.setItem("covate", JSON.stringify(covate));
}

function aggiungiPulcino() {
  const nome = prompt("Nome del pulcino:");
  const sesso = prompt("Sesso (Maschio, Femmina, Incerto):");
  const dataNascita = prompt("Data di nascita (YYYY-MM-DD):");
  const covata = prompt("Covata di origine (es. L01):");
  if (nome && sesso && dataNascita && covata) {
    pulcini.push({
      nome,
      sesso,
      dataNascita,
      covata,
      fase: "pulcino",
      gabbia: ""
    });
    localStorage.setItem("pulcini", JSON.stringify(pulcini));
    render();
  }
}

function rimuoviCovata(index) {
  if (confirm("Sei sicuro di voler rimuovere questa covata?")) {
    covate.splice(index, 1);
    localStorage.setItem("covate", JSON.stringify(covate));
    render();
  }
}

function rimuoviPulcino(index) {
  const conferma = confirm(`Sei sicuro di voler rimuovere ${pulcini[index].nome}?`);
  if (conferma) {
    pulcini.splice(index, 1);
    localStorage.setItem("pulcini", JSON.stringify(pulcini));
    render();
  }
}

function modificaPulcino(index) {
  const p = pulcini[index];
  const nome = prompt("Modifica nome:", p.nome) || p.nome;
  const sesso = prompt("Modifica sesso (Maschio, Femmina, Incerto):", p.sesso) || p.sesso;
  const dataNascita = prompt("Modifica data nascita (YYYY-MM-DD):", p.dataNascita) || p.dataNascita;
  const covata = prompt("Modifica covata:", p.covata) || p.covata;

  pulcini[index] = { ...p, nome, sesso, dataNascita, covata };
  localStorage.setItem("pulcini", JSON.stringify(pulcini));
  render();
}

function evolviPulcino(index) {
  const gabbia = prompt("In quale gabbia spostare questo pulcino? (es. A, B, C)");
  if (gabbia) {
    pulcini[index].fase = "adulto";
    pulcini[index].gabbia = gabbia.toUpperCase();
    localStorage.setItem("pulcini", JSON.stringify(pulcini));
    render();
  }
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

  pulcini.filter(p => p.fase !== "adulto").forEach(p => {
    if (!gruppi[p.covata]) gruppi[p.covata] = [];
    gruppi[p.covata].push(p);
  });

  Object.keys(gruppi).forEach(covata => {
    const wrapper = document.createElement("div");
    wrapper.className = "covata";

    const header = document.createElement("h3");
    header.textContent = `▶ Covata ${covata}`;
    header.style.cursor = "pointer";

    const content = document.createElement("div");
    content.style.display = "none";
    content.style.marginLeft = "1rem";

    header.onclick = () => {
      const visible = content.style.display === "block";
      content.style.display = visible ? "none" : "block";
      header.textContent = `${visible ? '▶' : '▼'} Covata ${covata}`;
    };

    gruppi[covata].forEach((p, index) => {
      const eta = calcolaEta(p.dataNascita);
      const div = document.createElement("div");
      div.style.marginBottom = "0.5rem";
      const btnDettagli = document.createElement("button");
      btnDettagli.textContent = "📋 Dettagli";

      const scheda = document.createElement("div");
      scheda.style.display = "none";
      scheda.style.marginLeft = "1rem";
      scheda.style.borderLeft = "2px solid #ccc";
      scheda.style.paddingLeft = "1rem";
      scheda.innerHTML = `
        <p><strong>Nome:</strong> ${p.nome}</p>
        <p><strong>Sesso:</strong> ${p.sesso}</p>
        <p><strong>Età:</strong> ${eta} giorni</p>
        <p><strong>Data di nascita:</strong> ${p.dataNascita}</p>
        <p><strong>Covata di origine:</strong> ${p.covata}</p>
      `;

      const btnModifica = document.createElement("button");
      btnModifica.textContent = "✏️ Modifica";
      btnModifica.onclick = () => modificaPulcino(pulcini.indexOf(p));

      const btnEvolvi = document.createElement("button");
      btnEvolvi.textContent = "⬆️ Sposta in adulti";
      btnEvolvi.style.marginLeft = "0.5rem";
      btnEvolvi.onclick = () => evolviPulcino(pulcini.indexOf(p));

      const btnRimuovi = document.createElement("button");
      btnRimuovi.textContent = "❌ Rimuovi";
      btnRimuovi.style.marginLeft = "0.5rem";
      btnRimuovi.onclick = () => rimuoviPulcino(pulcini.indexOf(p));

      scheda.appendChild(btnModifica);
      scheda.appendChild(btnEvolvi);
      scheda.appendChild(btnRimuovi);

      btnDettagli.onclick = () => {
        scheda.style.display = scheda.style.display === "none" ? "block" : "none";
      };

      div.innerHTML = `• ${p.nome} (${p.sesso} - ${eta} giorni) `;
      div.appendChild(btnDettagli);
      content.appendChild(div);
      content.appendChild(scheda);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);
    registroPulciniDiv.appendChild(wrapper);
  });
}

function renderAdulti() {
  adultiContainer.innerHTML = "<h2>🪶 Quaglie Adulte per Gabbia</h2>";
  const gruppi = {};

  pulcini.filter(p => p.fase === "adulto").forEach(p => {
    if (!gruppi[p.gabbia]) gruppi[p.gabbia] = [];
    gruppi[p.gabbia].push(p);
  });

  Object.keys(gruppi).forEach(gabbia => {
    const section = document.createElement("div");
    section.className = "covata";
    const h3 = document.createElement("h3");
    h3.textContent = `Gabbia ${gabbia}`;
    section.appendChild(h3);

    gruppi[gabbia].forEach(p => {
      const eta = calcolaEta(p.dataNascita);
      const el = document.createElement("p");
      el.textContent = `• ${p.nome} (${p.sesso} - ${eta} giorni) – da Covata ${p.covata}`;
      section.appendChild(el);
    });

    adultiContainer.appendChild(section);
  });
}

function renderDashboard() {
  dashboardContainer.innerHTML = "";
  covate.forEach((covata, index) => {
    const container = document.createElement("div");
    container.className = "dashboard-entry";

    const info = document.createElement("div");
    info.className = "dashboard-info";
    const pulciniCovata = pulcini.filter(p => p.covata === covata.nome && p.fase !== "adulto");
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
