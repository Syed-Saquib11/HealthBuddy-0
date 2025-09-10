const diseaseCardList = document.getElementById("diseaseCardList");
const searchInput = document.getElementById("searchInput");
let diseases = [];
let expandedCardIdx = -1; // Track which card is expanded

function getIconByDisease(name) {
  // Add more icons as needed
  if (name.toLowerCase().includes("flu")) return "🌡️";
  if (name.toLowerCase().includes("cold")) return "💧";
  if (name.toLowerCase().includes("dengue")) return "🦟";
  if (name.toLowerCase().includes("fever")) return "🌡️";
  if (name.toLowerCase().includes("malaria")) return "🦟";
  return "🦠";
}

function getSeverityClass(severity = "Low") {
  let sev = severity.toLowerCase();
  if (sev.includes("high")) return "severity-badge severity-high";
  if (sev.includes("medium")) return "severity-badge severity-medium";
  return "severity-badge severity-low";
}

// Modern card-based disease list
function renderDiseaseCardList(filter = "") {
  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase())
  );
  diseaseCardList.innerHTML = "";
  if (filtered.length === 0) {
    diseaseCardList.innerHTML = "<p>No diseases found.</p>";
    return;
  }
  filtered.forEach((disease, idx) => {
    // Begin card
    const card = document.createElement("div");
    card.classList.add("disease-card");

    // Card header
    card.innerHTML = `
      <div class="card-header">
        <span class="disease-icon">${getIconByDisease(disease.name)}</span>
        <span class="disease-title">${disease.name}</span>
        <span class="${getSeverityClass(disease.severity)}">
          ${disease.severity ? disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1) : "Low"}
        </span>
      </div>
      <div class="card-body">
        <div class="disease-section-title">Common Symptoms:</div>
        <div class="disease-chip-list">
          ${(disease.symptoms || []).map(symptom => `<span class="disease-chip">${symptom}</span>`).join("")}
        </div>
        <button class="disease-learn-btn">${expandedCardIdx === idx ? "Hide Details" : "Learn More"}</button>
        ${expandedCardIdx === idx ? `
          <div class="disease-expand">
            ${disease['seek_help'] ? `<div class="disease-section-title">When to Seek Help:</div>
              <div style="margin-bottom:0.7em;">${disease.seek_help}</div>` : ""}
            <div class="disease-section-title">Prevention:</div>
            <ul>` + (Array.isArray(disease.prevention)
              ? disease.prevention.map(item => `<li>${item}</li>`).join("")
              : `<li>${disease.prevention}</li>`) + `</ul>
            ${disease.treatment ? `
                <div class="disease-section-title">Treatment:</div>
                <div>${disease.treatment}</div>` : ""}
            ${disease['description'] ? `
                <div class="disease-section-title" style="margin-top:.7em">About:</div>
                <div>${disease.description}</div>` : ""}
          </div>
        ` : ""}
      </div>
    `;
    // Expand/collapse functionality
    card.querySelector('.disease-learn-btn').onclick = () => {
      expandedCardIdx = expandedCardIdx === idx ? -1 : idx;
      renderDiseaseCardList(searchInput.value);
    };
    diseaseCardList.appendChild(card);
  });
}

// Load diseases on page load
async function loadDiseases() {
  const response = await fetch("data/common-diseases.json");
  diseases = await response.json();
  renderDiseaseCardList();
}

searchInput.addEventListener("input", e => {
  expandedCardIdx = -1; // collapse all on new search
  renderDiseaseCardList(e.target.value);
});

loadDiseases();
