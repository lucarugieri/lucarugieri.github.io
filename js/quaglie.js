
const covateContainer = document.getElementById("covate");
const pulciniContainer = document.getElementById("pulcini");
const dashboardContainer = document.getElementById("dashboard");
const timelineContainer = document.getElementById("timeline");

let covate = JSON.parse(localStorage.getItem("covate")) || [];
let pulcini = JSON.parse(localStorage.getItem("pulcini")) || [];
let schiuse = JSON.parse(localStorage.getItem("schiuse")) || {};

function render() {
  renderDashboard();
  renderTimeline();
  renderCovate();
  renderPulcini();
}

function renderTimeline() {
  timelineContainer.innerHTML = "";
  if (covate.length === 0) {
    timelineContainer.innerHTML = "<p>Nessuna covata registrata.</p>";
    return;
  }

  covate.forEach(covata => {
    const nome = covata.nome;
    let dataSchiusa = schiuse[nome];

    if (!dataSchiusa) {
      dataSchiusa = prompt(`Inserisci la data di schiusa per la covata ${nome} (YYYY-MM-DD):`);
      if (dataSchiusa) {
        schiuse[nome] = dataSchiusa;
        localStorage.setItem("schiuse", JSON.stringify(schiuse));
      } else {
        return;
      }
    }

    const start = new Date(dataSchiusa);
    const grower = new Date(start);
    grower.setDate(grower.getDate() + 21);
    const layer = new Date(grower);
    layer.setDate(layer.getDate() + 21);

    const format = d => d.toISOString().split("T")[0];

    const box = document.createElement("div");
    box.className = "covata";
    box.innerHTML = `
      <h3>Covata ${nome}</h3>
      <ul>
        <li><strong>Starter:</strong> ${format(start)} → ${format(grower)}</li>
        <li><strong>Grower:</strong> ${format(grower)} → ${format(layer)}</li>
        <li><strong>Layer:</strong> ${format(layer)} → ∞</li>
      </ul>
    `;
    timelineContainer.appendChild(box);
  });
}

function renderDashboard() {
  dashboardContainer.innerHTML = "";
  if (covate.length === 0) {
    dashboardContainer.innerHTML = "<p>Nessuna covata registrata.</p>";
    return;
  }

  const summary = document.createElement("div");
  summary.className = "dashboard";

  let totaleUova = 0;
  let totalePulcini = 0;

  covate.forEach(covata => {
    const pulciniCovata = pulcini.filter(p => p.covata === covata.nome);
    const nati = pulciniCovata.length;
    const hatchRate = covata.uovaTotali > 0 ? Math.round((nati / covata.uovaTotali) * 100) : 0;

    totaleUova += covata.uovaTotali;
    totalePulcini += nati;

    const box = document.createElement("div");
    box.className = "covata";
    box.innerHTML = `
      <h3>${covata.nome}</h3>
      <p><strong>Uova Totali:</strong> ${covata.uovaTotali}</p>
      <p><strong>Pulcini Nati:</strong> ${nati}</p>
      <p><strong>Hatch Rate:</strong> ${hatchRate}%</p>
    `;
    summary.appendChild(box);
  });

  const totaleBox = document.createElement("div");
  totaleBox.className = "covata";
  const totaleRate = totaleUova > 0 ? Math.round((totalePulcini / totaleUova) * 100) : 0;
  totaleBox.innerHTML = `
    <h3>Totale</h3>
    <p><strong>Uova Totali:</strong> ${totaleUova}</p>
    <p><strong>Pulcini Nati:</strong> ${totalePulcini}</p>
    <p><strong>Hatch Rate Medio:</strong> ${totaleRate}%</p>
  `;
  summary.appendChild(totaleBox);

  dashboardContainer.appendChild(summary);
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

function renderPulcini() {
  pulciniContainer.innerHTML = "";
  pulcini.forEach((pulcino, index) => {
    const eta = calcolaEta(pulcino.dataNascita);
    const div = document.createElement("div");
    div.className = "covata";
    div.innerHTML = `
      <h3>${pulcino.nome}</h3>
      <p><strong>Sesso:</strong> ${pulcino.sesso}</p>
      <p><strong>Età:</strong> ${eta} giorni</p>
      <p><strong>Covata di origine:</strong> ${pulcino.covata}</p>
      <button onclick="rimuoviPulcino(${index})">Rimuovi</button>
      <hr/>
    `;
    pulciniContainer.appendChild(div);
  });
  localStorage.setItem("pulcini", JSON.stringify(pulcini));
}

function aggiungiCovata() {
  const nome = prompt("Nome Covata (es. L02):");
  const data = prompt("Data Inizio (YYYY-MM-DD):");
  const uova = prompt("Numero totale uova:");
  const razze = prompt("Razze:");
  if (nome && data && uova && razze) {
    covate.push({
      nome: nome,
      dataInizio: data,
      uovaTotali: parseInt(uova),
      razze: razze
    });
    render();
  }
}

function rimuoviCovata(index) {
  if (confirm("Sei sicuro di voler rimuovere questa covata?")) {
    covate.splice(index, 1);
    render();
  }
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
      covata
    });
    render();
  }
}

function rimuoviPulcino(index) {
  if (confirm("Sei sicuro di voler rimuovere questo pulcino?")) {
    pulcini.splice(index, 1);
    render();
  }
}

function calcolaEta(dataNascita) {
  const oggi = new Date();
  const nascita = new Date(dataNascita);
  const diff = oggi - nascita;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

render();
