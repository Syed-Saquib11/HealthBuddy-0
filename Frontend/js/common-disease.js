// ...existing code...
/*
 Rewritten common-disease.js
 - waits for DOMContentLoaded
 - fetches data from data/common-diseases.json (requires http server)
 - renders searchable, expandable disease cards
*/

(() => {
  let diseases = [];
  let expandedIdx = -1;

  function getIconByDisease(name = "") {
    const n = name.toLowerCase();
    if (n.includes("flu")) return "🌡️";
    if (n.includes("cold")) return "🤧";
    if (n.includes("dengue")) return "🦟";
    if (n.includes("fever")) return "🌡️";
    if (n.includes("malaria")) return "🧪";
    return "🦠";
  }

  function getSeverityClass(severity = "Low") {
    const s = (severity || "Low").toLowerCase();
    if (s.includes("high")) return "badge high";
    if (s.includes("medium")) return "badge medium";
    return "badge low";
  }

  function createCard(disease, idx) {
    const card = document.createElement("div");
    card.className = "disease-card";

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `
      <span class="disease-icon">${getIconByDisease(disease.name)}</span>
      <span class="disease-title">${disease.name || "Unknown"}</span>
      <span class="${getSeverityClass(disease.severity)}">${disease.severity ? disease.severity : "Low"}</span>
    `;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "card-body";

    const symptomsTitle = document.createElement("div");
    symptomsTitle.className = "disease-section-title";
    symptomsTitle.textContent = "Common Symptoms:";
    body.appendChild(symptomsTitle);

    const chipList = document.createElement("div");
    chipList.className = "disease-chip-list";
    (disease.symptoms || []).forEach(s => {
      const chip = document.createElement("span");
      chip.className = "disease-chip";
      chip.textContent = s;
      chipList.appendChild(chip);
    });
    body.appendChild(chipList);

    const btn = document.createElement("button");
    btn.className = "disease-learn-btn";
    btn.type = "button";
    btn.textContent = (expandedIdx === idx) ? "Hide Details" : "Learn More";
    btn.addEventListener("click", () => {
      expandedIdx = (expandedIdx === idx) ? -1 : idx;
      renderList(currentFilter()); // re-render to reflect expanded state
    });
    body.appendChild(btn);

    if (expandedIdx === idx) {
      const expand = document.createElement("div");
      expand.className = "disease-expand";

      if (disease.seek_help) {
        const whenTitle = document.createElement("div");
        whenTitle.className = "disease-section-title";
        whenTitle.textContent = "When to Seek Help:";
        expand.appendChild(whenTitle);

        const whenText = document.createElement("div");
        whenText.style.marginBottom = ".7em";
        whenText.textContent = disease.seek_help;
        expand.appendChild(whenText);
      }

      const preventTitle = document.createElement("div");
      preventTitle.className = "disease-section-title";
      preventTitle.textContent = "Prevention:";
      expand.appendChild(preventTitle);

      const ul = document.createElement("ul");
      if (Array.isArray(disease.prevention)) {
        disease.prevention.forEach(p => {
          const li = document.createElement("li");
          li.textContent = p;
          ul.appendChild(li);
        });
      } else if (disease.prevention) {
        const li = document.createElement("li");
        li.textContent = disease.prevention;
        ul.appendChild(li);
      }
      expand.appendChild(ul);

      if (disease.treatment) {
        const tTitle = document.createElement("div");
        tTitle.className = "disease-section-title";
        tTitle.textContent = "Treatment:";
        expand.appendChild(tTitle);

        const tDiv = document.createElement("div");
        tDiv.textContent = disease.treatment;
        expand.appendChild(tDiv);
      }

      if (disease.description) {
        const aTitle = document.createElement("div");
        aTitle.className = "disease-section-title";
        aTitle.textContent = "About:";
        expand.appendChild(aTitle);

        const aDiv = document.createElement("div");
        aDiv.textContent = disease.description;
        expand.appendChild(aDiv);
      }

      body.appendChild(expand);
    }

    card.appendChild(body);
    return card;
  }

  function currentFilter() {
    const si = document.getElementById("searchInput");
    return si ? si.value.trim() : "";
  }

  function renderList(filter = "") {
    const listEl = document.getElementById("diseaseCardList") || createCardGrid();
    listEl.innerHTML = "";
    const f = (filter || "").toLowerCase();
    const filtered = diseases.filter(d => (d.name || "").toLowerCase().includes(f));
    if (filtered.length === 0) {
      listEl.innerHTML = "<p>No diseases found.</p>";
      return;
    }
    filtered.forEach((d, i) => {
      const realIdx = diseases.indexOf(d); // map back to original index for expand toggle stability
      listEl.appendChild(createCard(d, realIdx));
    });
  }

  function createCardGrid() {
    const container = document.querySelector(".common-diseases") || document.body;
    const grid = document.createElement("div");
    grid.id = "diseaseCardList";
    grid.className = "card-grid";
    container.appendChild(grid);
    return grid;
  }

  async function loadData() {
    // if served from file:// show helpful message
    if (location.protocol === "file:") {
      const container = document.querySelector(".common-diseases") || document.body;
      container.innerHTML = `<p class="error">Fetching local JSON via file:// is blocked. Serve the folder over HTTP (use Live Server or 'python -m http.server') and reload.</p>`;
      console.error("Refusing to fetch from file://. Use a local server.");
      return;
    }

    try {
      const resp = await fetch("data/common-diseases.json");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      diseases = await resp.json();
      // ensure card grid exists
      createCardGrid();
      // attach search handler
      const si = document.getElementById("searchInput");
      if (si) {
        si.addEventListener("input", () => {
          expandedIdx = -1;
          renderList(si.value);
        });
      }
      renderList();
    } catch (err) {
      console.error("Failed to load diseases:", err);
      const container = document.querySelector(".common-diseases") || document.body;
      container.innerHTML = `<p class="error">Failed to load diseases data. Ensure data/common-diseases.json exists and you're serving files over HTTP. (${err.message})</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ensure search input and grid exist for older templates
    if (!document.getElementById("diseaseCardList")) createCardGrid();
    loadData();
  });
})();