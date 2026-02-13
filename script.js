let maxBudget = 0;
let budget = 0;
let dadoDanno = 2;
let valoreArmatura = 0;
let statsIniziali = { bio: 0, psi: 0, inf: 0 };
let statsBonus = { bio: 0, psi: 0, inf: 0 };
let puntiFerita = 0;

const ROW_HEIGHT = 7;
const SLOT_BASE = 10;

const nomeInput = document.querySelector('.name-col input[type="text"]');
const btnPDF = document.getElementById("btn-crea-scheda");
const radiosBackground = document.querySelectorAll('input[name="occupazione"]');
const btnToggleTheme = document.getElementById("btn-toggle-theme");
const armiContainer = document.getElementById('armi-container');
const softwareContainer = document.getElementById('software-container');
const contenitoriContainer = document.getElementById('contenitori-container');
const cybermodificheContainer = document.getElementById('cybermodifiche-container');
const armaturaContainer = document.getElementById('armatura-container');

// Matrice: [arma, prezzo, danno, note]
const armi = [
  ["Coltello", 100, "d6", "arma da mischia leggera"],
  ["Mazza", 100, "d6", "arma da mischia leggera"],
  ["Spada", 400, "d8", "arma da mischia media"],
  ["Ascia", 400, "d8", "arma da mischia media"],
  ["Lame meccaniche", 650, "d10", "arma da mischia pesante, ingombrante"],
  ["Pistola", 150, "d6", "arma a distanza, gittata corta"],
  ["Doppietta", 150, "d6", "arma a distanza, gittata corta"],
  ["Fucile", 600, "d8", "arma a distanza, gittata media"],
  ["Arco", 600, "d8", "arma a distanza, gittata media"],
  ["Carabina", 1000, "d10", "arma a distanza, gittata lunga, ingombrante"],
  ["Cannone Laser", 1000, "d10", "arma a distanza, gittata lunga, ingombrante"],
  ["Lanciamissili", 1500, "d12 scoppio", "arma a distanza, gittata lunga, ingombrante"],
  ["Granata", 200, "d6 scoppio", ""],
  ["Microcariche", 150, "d4", ""],
  ["Esplosivo", dadoDanno*150, "d8 scoppio", ""],
  ["Cannone EMP", 2000, "d8 scoppio danno INF", "ingombrante"]
];

// Matrice: [software, prezzo, effetto]
const software = [
  ["Potenziatore di calcolo", 1000, "+1 ai PF del personaggio per le azioni nell'Infosfera"],
  ["Scudo", 5000, "+1 Armatura del personaggio per le azioni nell'Infosfera"],
  ["Potenziatore neurale", 5000, "+1 INF del per i tiri salvezza nell'Infosfera"],
  ["Icebreaker", dadoDanno*1500, "Danni extra durante l'hacking"],
  ["Virus da battaglia", dadoDanno*500, "Danno critico che infligge ferite aggiuntive"],
  ["Virus mutagenico", 1500, "Danno critico che non ferisce il bersaglio"],
  ["Utility", 1000, "Funzionalità aggiuntiva che non modifica le meccaniche di gioco *concordare gli effetti con il master*"],
];

// Matrice: [contenitore, prezzo, slot inventario]
const Contenitori = [
  ["Borsa", 200, "+2"],
  ["Borsone", 300, "+3"],
  ["Zaino", 400, "+4"],
  ["Trolley", 600, "+6"],
];

const Armatura = [
  ["Leggera", 1000, "+1"],
  ["Media", 2500, "+2 ingombrante"],
  ["Pesante", 5500, "+3 ingombrante"]
];

const cybermodifiche = [
    ["Arma montata",dadoDanno*1500,"*concordare con il master gli effetti*"],
    ["Armatura dermica",1000,"+1 armatura"],
    ["Tasca sottocutanea",1000,"+1 slot inventario"],
    ["Nascondiglio cyberbraccio/gamba",1000,"+1 slot inventario"],
    ["Neuroprocessore",dadoDanno*1500,"capacità di hacking e firewall nell'Infosfera"],
    ["Coprocessore di rete",3000,"+1 per prova di INF (attivazione)"],
    ["Rinforzo muscolo-scheletrico",3000,"+1 per prova di BIO (attivazione)"],
    ["Processore comportamentale",3000,"+1 per prova di PSI (attivazione)"],
    ["Accelleratore di neuroimpulsi",5000,"+1 BIO per le prove relative alla velocità di reazione"],
    ["Stabilizzatore muscolare",5000,"+1 BIO per le prove che comportano una manipolazione precisa del corpo"],
    ["Potenziatore cognitivo",5000,"+1 PSI per le prove relative a cognizione, conoscenza e apprendimento (attivazione)"],
    ["Stimolatore Bio/Psi/Neurale",3500,"Prove più facili per BIO/PSI/INF (attivazione)"],
    ["Biosistema tattico",3000,"+1 PF durante la risoluzione di un attacco (attivazione)"],
    ["Impianto mirato",dadoDanno*500,"Lesioni critiche selezionate senza ferite (attivazione)"],
    ["Neurocontrollore drone/veicolo",1000,"+1 BIO per le prove di guida (attivazione)"],
    ["Neurocontrollore dell'arma",3500,"Danno critico che infligge ferite aggiuntive (attivazione)"]
  
]

// Genera dinamicamente i checkbox
armi.forEach((arma, index) => {
  const [nome, prezzo, danno, note] = arma;

  // Crea un label
  const label = document.createElement('label');
  label.style.display = "block"; // per andare a capo

  // Crea checkbox
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', function () {
    gestisciCheckboxBudget(this);
  });
  checkbox.type = 'checkbox';
  checkbox.name = 'arma';
  checkbox.value = index; // opzionale, puoi usare l'indice
  checkbox.dataset.prezzo = prezzo;
  checkbox.dataset.danno = danno;
  checkbox.dataset.note = note;

  // Testo del label
  label.textContent = `${nome} — Prezzo: ${prezzo}, Danno: ${danno}, Note: ${note}`;

  // Inserisci la checkbox dentro il label
  label.prepend(checkbox);

  // Aggiungi al container
  armiContainer.appendChild(label);
});

// Genera dinamicamente i checkbox
software.forEach((software, index) => {
  const [nome, prezzo, note] = software;

  // Crea un label
  const label = document.createElement('label');
  label.style.display = "block"; // per andare a capo

  // Crea checkbox
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', function () {
    gestisciCheckboxBudget(this);
  });
  checkbox.type = 'checkbox';
  checkbox.name = 'software';
  checkbox.value = index; // opzionale, puoi usare l'indice
  checkbox.dataset.prezzo = prezzo;
  checkbox.dataset.note = note;

  // Testo del label
  label.textContent = `${nome} — Prezzo: ${prezzo}, Effetto: ${note}`;

  // Inserisci la checkbox dentro il label
  label.prepend(checkbox);

  // Aggiungi al container
  softwareContainer.appendChild(label);
});

// Genera dinamicamente i checkbox
Contenitori.forEach((contenitore, index) => {
  const [nome, prezzo, slot] = contenitore;

  // Crea un label
  const label = document.createElement('label');
  label.style.display = "block"; // per andare a capo

  // Crea checkbox
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', function () {
    gestisciCheckboxBudget(this);
  });
  checkbox.type = 'checkbox';
  checkbox.name = 'contenitore';
  checkbox.value = index; // opzionale, puoi usare l'indice
  checkbox.dataset.prezzo = prezzo;
  checkbox.dataset.slot = slot;

  // Testo del label
  label.textContent = `${nome} — Prezzo: ${prezzo}, Slot inventario: ${slot}`;

  // Inserisci la checkbox dentro il label
  label.prepend(checkbox);

  // Aggiungi al container
  contenitoriContainer.appendChild(label);
});

// Genera dinamicamente i checkbox
Armatura.forEach((armatura, index) => {
  const [nome, prezzo, effetto] = armatura;

  // Crea un label
  const label = document.createElement('label');
  label.style.display = "block"; // per andare a capo

  // Crea checkbox
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', function () {
    gestisciCheckboxBudget(this);
  });
  checkbox.type = 'checkbox';
  checkbox.name = 'armatura';
  checkbox.value = index; // opzionale, puoi usare l'indice
  checkbox.dataset.prezzo = prezzo;
  checkbox.dataset.effetto = effetto;

  // Testo del label
  label.textContent = `${nome} — Prezzo: ${prezzo}, Effetto: ${effetto}`;

  // Inserisci la checkbox dentro il label
  label.prepend(checkbox);

  // Aggiungi al container
  armaturaContainer.appendChild(label);
});

// Genera dinamicamente i checkbox
cybermodifiche.forEach((cybermodifica, index) => {
  const [nome, prezzo, effetto] = cybermodifica;

  // Crea un label
  const label = document.createElement('label');
  label.style.display = "block"; // per andare a capo

  // Crea checkbox
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', function () {
    gestisciCheckboxBudget(this);
  });
  checkbox.type = 'checkbox';
  checkbox.name = 'cybermodifica';
  checkbox.value = index; // opzionale, puoi usare l'indice
  checkbox.dataset.prezzo = prezzo;
  checkbox.dataset.effetto = effetto;

  // Testo del label
  label.textContent = `${nome} — Prezzo: ${prezzo}, Effetto: ${effetto}`;

  // Inserisci la checkbox dentro il label
  label.prepend(checkbox);

  // Aggiungi al container
  cybermodificheContainer.appendChild(label);
});

// Funzioni lancio dadi
function lancioD4() {
  return Math.floor(Math.random() * 4) + 1;
}

function lancioD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function lancioD12() {
  return Math.floor(Math.random() * 12) + 1;
}

function lancio3D6() {
  return lancioD6() + lancioD6() + lancioD6();
}

// Calcola statistiche iniziali
function calcolaStatistiche() {
  valoreArmatura = 0;
  resetCheckbox();
  puntiFerita = lancioD6();
  statsIniziali.bio = lancio3D6();
  statsIniziali.psi = lancio3D6();
  statsIniziali.inf = lancio3D6();

  maxBudget = lancioD12() * 1000;
  budget = maxBudget;

  aggiornaBudget(budget);

  statsBonus = { bio: 0, psi: 0, inf: 0 };
  aggiornaStatisticheIniziali();
  aggiornaStatisticheBonus();
  aggiornaCheckboxDisabilitate();
  aggiornaSoftwareDisponibile();
}

// Funzione per aggiornare la progress bar
function aggiornaBudget(valore) {
  budget = valore; // salva il valore
  const bar = document.getElementById('budget-bar');
  const testo = document.getElementById('budget-val');

  bar.max = maxBudget;
  bar.value = budget;
  testo.textContent = budget + ' crediti';
}


function resetCheckbox() {
  document
    .querySelectorAll('input[type="checkbox"][data-prezzo]')
    .forEach(cb => {
      cb.checked = false;
      cb.disabled = false;
    });
}

// Aggiorna le caselle delle statistiche iniziali
function aggiornaStatisticheIniziali() {
  document.getElementById('val-pf').value = puntiFerita;
  document.getElementById('val-bio').value = statsIniziali.bio;
  document.getElementById('val-psi').value = statsIniziali.psi;
  document.getElementById('val-inf').value = statsIniziali.inf;
}

// Aggiorna le caselle dei bonus
function aggiornaStatisticheBonus() {
  document.getElementById('val-bio-bonus').value = statsBonus.bio;
  document.getElementById('val-psi-bonus').value = statsBonus.psi;
  document.getElementById('val-inf-bonus').value = statsBonus.inf;
}

function gestisciCheckboxBudget(checkbox) {
  const prezzo = Number(checkbox.dataset.prezzo);

  // Aggiorna il budget
  if (checkbox.checked) {
    budget -= prezzo;
  } else {
    budget += prezzo;
  }

  // --- Aggiorna inventario solo se è un'arma ---
  if (checkbox.name === "arma") {
    const nomeArma = checkbox.parentElement.textContent.trim();
    const inventario = document.querySelectorAll("#inventario .inv-item");

    if (checkbox.checked) {
      // Inserisci nell'inventario nel primo slot libero
      for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].value.trim() === "") {
          inventario[i].value = nomeArma;
          break;
        }
      }
    } else {
      // Rimuovi dall'inventario
      for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].value.trim() === nomeArma) {
          inventario[i].value = "";
          break;
        }
      }
    }
  }

  aggiornaBudget(budget);
  aggiornaCheckboxDisabilitate();
  aggiornaValoreArmatura();

  if (checkbox.name === "contenitore") {
    aggiornaSlotInventario();
  }

  if (checkbox.name === "cybermodifica") {
    aggiornaSoftwareDisponibile();
  }

}


function aggiornaCheckboxDisabilitate() {
  document.querySelectorAll('input[type="checkbox"][data-prezzo]').forEach(cb => {
    const prezzo = Number(cb.dataset.prezzo);

    if (!cb.checked && prezzo > budget) {
      cb.disabled = true;
    } else {
      cb.disabled = false;
    }
  });
}

function aggiornaSoftwareDisponibile() {

  // Cerca se il neuroprocessore è selezionato
  const neuroSelezionato = Array.from(
    document.querySelectorAll('input[name="cybermodifica"]:checked')
  ).some(cb => cb.parentElement.textContent.includes("Neuroprocessore"));

  // Tutti i software
  const softwareCheckbox = document.querySelectorAll('input[name="software"]');

  softwareCheckbox.forEach(cb => {

    if (!neuroSelezionato) {
      cb.checked = false;   // deseleziona se attivo
      cb.disabled = true;   // disabilita
    } else {
      cb.disabled = false;  // riabilita (budget verrà controllato dopo)
    }

  });
}

function aggiornaValoreArmatura() {

  valoreArmatura = 0;

  // Armature equipaggiate
  document.querySelectorAll('input[name="armatura"]:checked').forEach(cb => {
    const effetto = cb.dataset.effetto;

    const match = effetto.match(/\+(\d+)/);
    if (match) {
      valoreArmatura += Number(match[1]);
    }
  });

  // Cybermodifica "Armatura dermica"
  document.querySelectorAll('input[name="cybermodifica"]:checked').forEach(cb => {
    if (cb.parentElement.textContent.includes("Armatura dermica")) {
      valoreArmatura += 1;
    }
  });

}

function aggiornaSlotInventario() {
  const inventarioDiv = document.getElementById("inventario");

  // Conta slot extra dai contenitori selezionati
  let slotExtra = 0;

  document.querySelectorAll('input[name="contenitore"]:checked').forEach(cb => {
    const slot = Number(cb.dataset.slot.replace("+", ""));
    slotExtra += slot;
  });

  const totaleSlot = SLOT_BASE + slotExtra;

  // Slot attualmente presenti
  const slotAttuali = inventarioDiv.querySelectorAll(".inv-item").length;

  // Se dobbiamo aggiungere slot
  if (totaleSlot > slotAttuali) {
    for (let i = slotAttuali + 1; i <= totaleSlot; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "inv-item";
      input.placeholder = "Oggetto " + i;
      inventarioDiv.appendChild(input);
    }
  }

  // Se dobbiamo rimuovere slot (solo quelli extra)
  if (totaleSlot < slotAttuali) {
    for (let i = slotAttuali; i > totaleSlot; i--) {
      const ultimo = inventarioDiv.querySelector(".inv-item:last-child");

      // Evita di cancellare oggetti pieni
      if (ultimo.value.trim() !== "") {
        alert("Rimuovi prima gli oggetti dagli slot extra!");
        return;
      }

      ultimo.remove();
    }
  }
}

function controllaAbilitazionePDF() {
  const nome = document.querySelector('.name-col input[type="text"]').value.trim();
  const backgroundSelezionato = document.querySelector('input[name="occupazione"]:checked');
  const btnPDF = document.getElementById("btn-crea-scheda");
  const errorDiv = document.getElementById("error-message");

  let messaggi = [];
  console.log(nome);
  console.log(backgroundSelezionato);
  if (nome === "") messaggi.push("Il nome del personaggio è obbligatorio.");
  if (!backgroundSelezionato) messaggi.push("Il background è obbligatorio.");

  if (messaggi.length > 0) {
    // Mostra messaggio e disabilita pulsante
    errorDiv.innerHTML = messaggi.join("<br>");
    errorDiv.style.display = "block";
    btnPDF.disabled = true;
  } else {
    // Tutto ok, nascondi messaggio e abilita pulsante
    errorDiv.style.display = "none";
    btnPDF.disabled = false;
  }
}

function generaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;

  function checkPage() {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
  }

  function writeBlock(text) {
    const righe = doc.splitTextToSize(text, 180);
    doc.text(righe, 10, y);
    y += righe.length * 7;
    checkPage();
  }

  // --- NOME ---
  const nome = document.querySelector('.name-col input[type="text"]').value || "Personaggio";

  doc.setFontSize(16);
  doc.text("SCHEDA PERSONAGGIO - CYBER", 10, y);
  y += 12;

  doc.setFontSize(12);
  doc.text("Nome: " + nome, 10, y);
  y += 10;

  // --- STATISTICHE TOTALI ---
  const bioTot = Number(statsIniziali.bio) + Number(statsBonus.bio);
  const psiTot = Number(statsIniziali.psi) + Number(statsBonus.psi);
  const infTot = Number(statsIniziali.inf) + Number(statsBonus.inf);

  doc.text("=== STATISTICHE ===", 10, y);
  y += 8;

  writeBlock("Punti Ferita: " + puntiFerita);
  writeBlock("Armatura: " + valoreArmatura);
  writeBlock("BIO: " + bioTot + " (Base " + statsIniziali.bio + " + Bonus " + statsBonus.bio + ")");
  writeBlock("PSI: " + psiTot + " (Base " + statsIniziali.psi + " + Bonus " + statsBonus.psi + ")");
  writeBlock("INF: " + infTot + " (Base " + statsIniziali.inf + " + Bonus " + statsBonus.inf + ")");
  y += 5;

  // --- ECONOMIA ---
  doc.text("=== ECONOMIA ===", 10, y);
  y += 8;
  writeBlock("Budget: " + budget + " crediti");
  y += 5;

  // --- BACKGROUND SELEZIONATO ---
  const bgSelezionato = document.querySelector('input[name="occupazione"]:checked');

  if (bgSelezionato) {
    const label = bgSelezionato.parentElement;
    console.log(label);
    const nomeBackground = label.innerText.split("(")[0];

    doc.text("=== BACKGROUND ===", 10, y);
    y += 5;

    writeBlock("Background: " + nomeBackground);

  }

  // --- NOTE BACKGROUND ---
  const noteBackground = document.querySelector('textarea[placeholder]').value;

  if (noteBackground.trim() !== "") {
    y += 8;
    writeBlock(noteBackground);
    y += 5;
  }



  // --- EQUIPAGGIAMENTO ---
  function stampaSelezionati(titolo, name) {
    const selezionati = document.querySelectorAll(`input[name="${name}"]:checked`);

    if (selezionati.length > 0) {
      doc.text("=== " + titolo + " ===", 10, y);
      y += 8;

      selezionati.forEach(cb => {
        const testo = cb.parentElement.textContent.trim();
        writeBlock("- " + testo);
      });

      y += 5;
    }
  }

  stampaSelezionati("ARMATURE", "armatura");
  stampaSelezionati("CYBERMODIFICHE", "cybermodifica");
  stampaSelezionati("SOFTWARE", "software");
  stampaSelezionati("CONTENITORI", "contenitore");

    // --- INVENTARIO ---
  const items = document.querySelectorAll("#inventario .inv-item");
  let inventarioItems = [];

  items.forEach(input => {
    if (input.value.trim() !== "") {
      inventarioItems.push(input.value.trim());
    }
  });

  if (inventarioItems.length > 0) {
    doc.text("=== INVENTARIO ===", 10, y);
    y += 8;

    inventarioItems.forEach(item => {
      doc.text("- " + item, 10, y);
      y += ROW_HEIGHT;

      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    });

    y += 5;
  }

  doc.save("Scheda_" + nome + ".pdf");
}


radiosBackground.forEach(radio => {
  radio.addEventListener('change', function() {
    // Reset bonus
    statsBonus = { bio: 0, psi: 0, inf: 0 };

    // Nascondi tutti i sottoradio
    document.querySelectorAll('.scelta-bonus').forEach(div => div.style.display = 'none');

    // Controlla se la scelta ha un sottoradio
    const sceltaBonusDiv = radio.parentElement.querySelector('.scelta-bonus');
    if (sceltaBonusDiv) {
      // Mostra il sottoradio
      sceltaBonusDiv.style.display = 'block';
      sceltaBonusDiv.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);

      // Listener per il sottoradio
      sceltaBonusDiv.querySelectorAll('input[type="radio"]').forEach(rb => {
        rb.addEventListener('change', function() {
          // Reset bonus
          statsBonus = { bio: 0, psi: 0, inf: 0 };

          if (rb.value === "Bio") statsBonus.bio = 1;
          if (rb.value === "Psi") statsBonus.psi = 1;
          if (rb.value === "Inf") statsBonus.inf = 1;

          aggiornaStatisticheBonus();
          controllaAbilitazionePDF();
        }, { once: true });
      });

    } else {
      // Applica bonus diretto
      const descrizione = radio.parentElement.querySelector('.descrizione').textContent;

      statsBonus.bio = descrizione.includes("Bio +1") ? 1 : 0;
      statsBonus.psi = descrizione.includes("Psi +1") ? 1 : 0;
      statsBonus.inf = descrizione.includes("Inf +1") ? 1 : 0;

      aggiornaStatisticheBonus();
    }
  });
});

// ascolta modifiche al nome
nomeInput.addEventListener('input', controllaAbilitazionePDF);

// ascolta modifiche al background
radiosBackground.forEach(radio => {
  radio.addEventListener('change', controllaAbilitazionePDF);
});

// Pulsante calcola statistiche
document.getElementById('btn-calcola').addEventListener('click', calcolaStatistiche);

// Chiama la funzione anche quando l'utente scrive il nome
document.querySelector('.name-col input[type="text"]')
        .addEventListener('input', controllaAbilitazionePDF);

// Chiama la funzione quando cambia il background
document.querySelectorAll('input[name="occupazione"]')
        .forEach(radio => radio.addEventListener('change', controllaAbilitazionePDF));

document.getElementById("btn-crea-scheda").addEventListener("click", generaPDF);

// Imposta tema iniziale
document.body.classList.add("dark-theme");

btnToggleTheme.addEventListener("click", () => {
  if (document.body.classList.contains("light-theme")) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    btnToggleTheme.textContent = "🌞"; // icona sole
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    btnToggleTheme.textContent = "🌙"; // icona luna
  }
});

// disabilita all'inizio
btnPDF.disabled = true;
calcolaStatistiche();
controllaAbilitazionePDF();

