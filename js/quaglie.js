
const covateContainer = document.getElementById("covate");

let covate = JSON.parse(localStorage.getItem("covate")) || [
  {
    nome: "L01",
    dataInizio: "2025-04-26",
    uovaTotali: 24,
    razze: "Italian Coturnix, Sparkly Coturnix"
  }
];

function render() {
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

render();
