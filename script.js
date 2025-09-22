const list = document.getElementById("offspring-list");
const simulateBtn = document.getElementById("simulate");

// =============================
// 🔬 Core Functions
// =============================
function combine(parent1, parent2) {
  const alleles1 = parent1.split("");
  const alleles2 = parent2.split("");
  const combos = [];
  for (let a of alleles1) {
    for (let b of alleles2) {
      const genotype = [a, b]
        .sort((x, y) => (x === x.toUpperCase() ? -1 : 1))
        .join("");
      combos.push(genotype);
    }
  }
  return combos;
}

function analyzeGene(p1, p2, dominantTrait, recessiveTrait) {
  const combos = combine(p1, p2);
  const counts = {};
  combos.forEach(g => (counts[g] = (counts[g] || 0) + 1));
  const total = combos.length;
  return Object.entries(counts).map(([genotype, count]) => ({
    genotype,
    probability: count / total,
    phenotype: /[A-Z]/.test(genotype[0]) ? dominantTrait : recessiveTrait
  }));
}

function drawHuman(eyeColor, hairType) {
  const eyeFill = eyeColor === "Brown Eyes" ? "brown" : "blue";
  const hairFill = hairType === "Curly Hair" ? "saddlebrown" : "goldenrod";
  let hairSVG = "";

  if (hairType === "Curly Hair") {
    const curls = [];
    for (let i = 0; i < 10; i++) {
      const offsetX = Math.random() * 20 - 10;
      const offsetY = Math.random() * 10 - 5;
      curls.push(`<path d="M${30 + i * 8 + offsetX} ${40 + offsetY} 
                    C${40 + i * 10 + offsetX} ${10 + offsetY} 
                    ${50 + i * 10 + offsetX} ${50 + offsetY} 
                    ${60 + i * 10 + offsetX} ${40 + offsetY}" 
                    stroke="${hairFill}" stroke-width="3" fill="none"/>`);
    }
    hairSVG = `<g>${curls.join("")}</g>`;
  } else {
    hairSVG = `<rect x="50" y="10" width="100" height="40" fill="${hairFill}" rx="30" />`;
  }

  return `
    <svg class="human" viewBox="0 0 200 300" width="100">
      <circle cx="100" cy="80" r="60" fill="#fcd5b5" stroke="#000" />
      ${hairSVG}
      <circle cx="75" cy="70" r="10" fill="${eyeFill}" />
      <circle cx="125" cy="70" r="10" fill="${eyeFill}" />
      <rect x="60" y="140" width="80" height="120" fill="#4f46e5" stroke="#000" rx="10" />
    </svg>
  `;
}

function alleleBadge(genotype) {
  return `<span style="
    padding:3px 8px;
    border-radius:6px;
    color:#fff;
    background:${genotype === genotype.toUpperCase() ? "#3b82f6" : "#16a34a"};
    font-weight:bold;
    margin-left:6px;
    font-size:0.85rem;
    box-shadow:0 2px 5px rgba(0,0,0,0.2);
  ">${genotype}</span>`;
}

// =============================
// 🎲 Punnett Square
// =============================
function renderPunnettSquare(parent1, parent2, traitName, dominantTrait, recessiveTrait) {
  const container = document.createElement("div");
  container.className = "punnett-square";
  container.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
  container.style.borderRadius = "15px";
  container.style.padding = "20px";
  container.style.background = "#fff";

  const title = document.createElement("h3");
  title.textContent = `${traitName} - Parent 1: ${parent1} × Parent 2: ${parent2}`;
  title.style.color = "#4f46e5";
  title.style.marginBottom = "12px";
  container.appendChild(title);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.textAlign = "center";

  const alleles1 = parent1.split("");
  const alleles2 = parent2.split("");

  // Header row
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("td"));
  alleles2.forEach(a2 => {
    const th = document.createElement("th");
    th.textContent = a2;
    th.style.padding = "8px";
    th.style.background = "#eef2ff";
    th.style.color = "#1e40af";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  alleles1.forEach(a1 => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = a1;
    th.style.padding = "8px";
    th.style.background = "#eef2ff";
    tr.appendChild(th);

    alleles2.forEach(a2 => {
      const td = document.createElement("td");
      const genotype = [a1, a2].sort((x, y) => (x === x.toUpperCase() ? -1 : 1)).join("");
      const phenotype = /[A-Z]/.test(genotype[0]) ? dominantTrait : recessiveTrait;

      td.innerHTML = `
        <div style="font-weight:bold">${genotype}</div>
        <div style="font-size:0.85em; color:#555">${phenotype}</div>
      `;
      td.style.padding = "10px";
      td.style.border = "1px solid #ccc";
      td.style.background = /[A-Z]/.test(genotype[0])
        ? "linear-gradient(135deg, #dbeafe, #bfdbfe)"
        : "linear-gradient(135deg, #fef3c7, #fde68a)";
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
  container.appendChild(table);

  // ✅ Summary Cards
  const results = analyzeGene(parent1, parent2, dominantTrait, recessiveTrait);
  const summary = document.createElement("div");
  summary.className = "punnett-summary";
  summary.style.marginTop = "15px";

  const summaryTitle = document.createElement("h4");
  summaryTitle.textContent = "🔎 Genotype & Phenotype Breakdown";
  summaryTitle.style.color = "#4f46e5";
  summaryTitle.style.marginBottom = "10px";
  summaryTitle.style.fontWeight = "bold";
  summary.appendChild(summaryTitle);

  results.forEach(r => {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.justifyContent = "space-between";
    card.style.alignItems = "center";
    card.style.margin = "6px 0";
    card.style.padding = "10px 14px";
    card.style.borderRadius = "10px";
    card.style.background = /[A-Z]/.test(r.genotype[0])
      ? "linear-gradient(135deg, #93c5fd, #3b82f6)"
      : "linear-gradient(135deg, #fcd34d, #f59e0b)";
    card.style.color = "#fff";
    card.style.boxShadow = "0 3px 8px rgba(0,0,0,0.15)";

    card.innerHTML = `
      <span style="font-weight:bold">${r.genotype}</span>
      <span>${(r.probability * 100).toFixed(0)}%</span>
      <span>${r.phenotype}</span>
    `;
    summary.appendChild(card);
  });

  container.appendChild(summary);
  document.getElementById("punnett-container").appendChild(container);
}

// =============================
// 👶 Offspring Grid
// =============================
function renderOffspringGrid(eyeResults, hairResults) {
  const container = document.createElement("div");
  container.className = "offspring-grid-container";

  const title = document.createElement("h3");
  title.textContent = "Combined Offspring";
  title.style.textAlign = "center";
  title.style.marginBottom = "15px";
  title.style.color = "#4f46e5";
  container.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "offspring-grid";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  grid.style.gap = "18px";

  eyeResults.forEach(e => {
    hairResults.forEach(h => {
      const jointProb = (e.probability * h.probability * 100).toFixed(0);
      const card = document.createElement("div");
      card.className = "card";
      card.style.background = "#fff";
      card.style.padding = "16px";
      card.style.borderRadius = "12px";
      card.style.textAlign = "center";
      card.style.boxShadow = "0 5px 12px rgba(0,0,0,0.15)";
      card.style.transition = "transform 0.2s";
      card.onmouseover = () => (card.style.transform = "translateY(-5px)");
      card.onmouseout = () => (card.style.transform = "translateY(0)");

      card.innerHTML = `
        <h4 style="color:#1e40af">Genotype</h4>
        <p>Eye: ${e.genotype} ${alleleBadge(e.genotype)} (${(e.probability * 100).toFixed(0)}%)</p>
        <p>Hair: ${h.genotype} ${alleleBadge(h.genotype)} (${(h.probability * 100).toFixed(0)}%)</p>
        <h4 style="color:#1e40af; margin-top:10px;">Phenotype</h4>
        <p>${e.phenotype} + ${h.phenotype}</p>
        ${drawHuman(e.phenotype, h.phenotype)}
        <p><span class="badge" style="
          background:#ef4444; 
          color:#fff; 
          padding:4px 10px; 
          border-radius:8px;
          font-weight:bold;
        ">Joint Probability: ${jointProb}%</span></p>
      `;
      grid.appendChild(card);
    });
  });

  container.appendChild(grid);
  list.appendChild(container);
}

// =============================
// ▶️ Event Listener
// =============================
simulateBtn.addEventListener("click", () => {
  list.innerHTML = "";
  document.getElementById("punnett-container").innerHTML = "";

  // Show "How It Works"
  const howItWorks = document.getElementById("how-it-works");
  howItWorks.innerHTML = `
    <h3 style="text-align:center; color:#4f46e5; margin-bottom:20px; font-size:1.8rem;">🧬 How It Works</h3>
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin-bottom:25px;">
      <div style="flex:1 1 220px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding:20px; border-radius:12px; text-align:center; font-weight:bold; color:#1e40af; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="font-size:2rem; margin-bottom:10px;">💙</div>
        Dominant Genes (B, C)
        <div style="font-weight:normal; font-size:0.95rem; margin-top:10px;">
          Only one copy needed to show trait<br>
          <b>(brown eyes, curly hair)</b>
        </div>
      </div>
      <div style="flex:1 1 220px; background: linear-gradient(135deg, #fef3c7, #fde68a); padding:20px; border-radius:12px; text-align:center; font-weight:bold; color:#78350f; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="font-size:2rem; margin-bottom:10px;">🟡</div>
        Recessive Genes (b, c)
        <div style="font-weight:normal; font-size:0.95rem; margin-top:10px;">
          Two copies needed to show trait<br>
          <b>(blue eyes, straight hair)</b>
        </div>
      </div>
    </div>
    <p style="text-align:center; font-size:1rem; color:#111827; max-width:700px; margin:auto; line-height:1.6;">
      <b>Therefore, the offspring’s traits depend on which alleles are passed on during fertilization. 
      Each parent contributes one allele per gene, and the combinations decide the physical traits. 
      Punnett squares visualize the probabilities, while the offspring grid shows all possible trait combinations.</b>
    </p>
  `;

  // Parents
  const eye1 = document.getElementById("eye1").value;
  const eye2 = document.getElementById("eye2").value;
  const hair1 = document.getElementById("hair1").value;
  const hair2 = document.getElementById("hair2").value;

  // Results
  const eyeResults = analyzeGene(eye1, eye2, "Brown Eyes", "Blue Eyes");
  const hairResults = analyzeGene(hair1, hair2, "Curly Hair", "Straight Hair");

  // Render
  renderPunnettSquare(eye1, eye2, "Eye Color", "Brown Eyes", "Blue Eyes");
  renderPunnettSquare(hair1, hair2, "Hair Type", "Curly Hair", "Straight Hair");
  renderOffspringGrid(eyeResults, hairResults);
});
