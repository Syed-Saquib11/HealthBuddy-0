const API_BASE = "http://localhost:8000/api";

document.getElementById('reportForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const disease_name = e.target.disease_name.value.trim();
  const city = e.target.city.value.trim();
  const state = e.target.state.value.trim();
  const severity = e.target.severity.value;
  const cases_reported = parseInt(e.target.cases_reported.value, 10);

  const payload = {
    disease_name,
    city,
    state,
    severity,
    cases_reported,
    date_reported: new Date().toISOString(),
  };

  const resultDiv = document.getElementById('resultMessage');
  resultDiv.textContent = "Submitting report...";

  try {
    const response = await fetch(`${API_BASE}/reported_outbreaks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      resultDiv.textContent = "Report submitted successfully!";
      e.target.reset();
    } else {
      const errorData = await response.json();
      resultDiv.textContent = `Failed to submit: ${errorData.message || "Unknown error"}`;
    }
  } catch (err) {
    resultDiv.textContent = "Error submitting report. Please try again.";
  }
});

async function loadCommunityReports() {
  const container = document.getElementById("communityReports");
  try {
    const response = await fetch(`${API_BASE}/reported_outbreaks`);
    if (!response.ok) throw new Error("Failed to fetch reports.");

    const reports = await response.json();

    if (!Array.isArray(reports) || reports.length === 0) {
      container.innerHTML = "<p>No community reports yet.</p>";
      return;
    }

    container.innerHTML = ""; // clear loading message

    const MAX_REPORTS = 12;

    const sortedReports = reports
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, MAX_REPORTS);

    reports.forEach(report => {
      const div = document.createElement("div");
      div.classList.add("report-card");
      div.innerHTML = `
        <strong>Disease:</strong> ${report.disease_name} <br />
        <strong>Location:</strong> ${report.city}, ${report.state} <br />
        <strong>Severity:</strong> ${report.severity} <br />
        <strong>Cases Reported:</strong> ${report.cases_reported ?? "N/A"} <br />
        <small>Reported on: ${new Date(report.created_at).toLocaleDateString()}</small>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    container.innerHTML = `<p>Error loading reports: ${error.message}</p>`;
  }
}

// Call this to load reports when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadCommunityReports();
});
