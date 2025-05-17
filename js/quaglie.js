
const covateContainer = document.getElementById("covate");
const pulciniContainer = document.getElementById("pulcini");

let covate = JSON.parse(localStorage.getItem("covate")) || [
  {
    nome: "L01",
    dataInizio: "2025-04-26",
    uovaTotali: 24,
    razze: "Italian Coturnix, Sparkly Coturnix"
  }
];

let pulcini = JSON.parse(localStorage.getItem("pulcini")) || [];

function render() {
  renderCovate();
  renderPulcini();
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
    renderCovate();
  }
}

function rimuoviCovata(index) {
  if (confirm("Sei sicuro di voler rimuovere questa covata?")) {
    covate.splice(index, 1);
    renderCovate();
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
    renderPulcini();
  }
}

function rimuoviPulcino(index) {
  if (confirm("Sei sicuro di voler rimuovere questo pulcino?")) {
    pulcini.splice(index, 1);
    renderPulcini();
  }
}

function calcolaEta(dataNascita) {
  const oggi = new Date();
  const nascita = new Date(dataNascita);
  const diff = oggi - nascita;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

render();
