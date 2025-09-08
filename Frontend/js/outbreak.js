const API_BASE = "http://localhost:8000/api";

// Utility: severity badge color
function severityColor(severity) {
  if (severity === "High") return "#ffb3b3";
  if (severity === "Medium") return "#ffe0b3";
  return "#cfffbe"; // low
}

async function loadOutbreaks() {
  const container = document.getElementById("outbreakList");
  container.innerHTML = "<p>Loading outbreaks...</p>";

  try {
    const response = await fetch(`${API_BASE}/all-outbreaks`);
    if (!response.ok) throw new Error("Failed to fetch outbreak data.");
    const outbreaks = await response.json();

    if (!Array.isArray(outbreaks) || outbreaks.length === 0) {
      container.innerHTML = "<p>No active outbreaks to display.</p>";
      return;
    }

    container.innerHTML = "";
    outbreaks.forEach(ob => {
  const div = document.createElement("div");
  div.classList.add("outbreak-card");
  
  // Color or badge based on severity or source
  div.style.background = ob.source === "user" ? "#d0f0fd" : severityColor(ob.severity);
  
  div.innerHTML = `
    <strong>${ob.disease_name}</strong> <br/>
    <strong>Location:</strong> ${ob.city || "N/A"}, ${ob.state || "N/A"}<br/>
    <strong>Cases:</strong> ${ob.cases_reported ?? "N/A"}<br/>
    <strong>Severity:</strong> ${ob.severity}<br/>
    <small>Reported on: ${new Date(ob.date_reported || ob.created_at).toLocaleDateString()}</small><br/>
    <small><em>Source: ${ob.source === "user" ? "Community Report" : "Official Data"}</em></small>
  `;
  container.appendChild(div);
});

  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadOutbreaks);
