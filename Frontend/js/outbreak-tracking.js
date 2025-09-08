// Base API URL
const API_BASE = "http://localhost:8000/api";

const citySelect = document.getElementById("citySelect");
const diseaseList = document.getElementById("diseaseList");
const sourceInfo = document.getElementById("sourceInfo");
const trendChartCtx = document.getElementById("trendChart").getContext('2d');

let allOutbreaks = [];        // Combined data from official + user
let filteredOutbreaks = [];   // Filtered by selected city
let trendingDiseases = [];    // Distinct trending diseases in selected city
let selectedDisease = null;    // Currently selected disease for chart

let trendChart = null;        // Chart.js instance

// Fetch merged outbreak data on page load
async function loadAllOutbreaks() {
  try {
    const response = await fetch(`${API_BASE}/all-outbreaks`);
    if (!response.ok) throw new Error("Failed to fetch outbreak data.");
    allOutbreaks = await response.json();
    populateCitySelector();
  } catch (err) {
    alert("Error loading data: " + err.message);
  }
}

// Populate city selector dynamically based on outbreaks data
function populateCitySelector() {
  const cities = new Set();
  allOutbreaks.forEach(o => {
    if (o.city) cities.add(o.city);
  });
  const sortedCities = [...cities].sort();

  sortedCities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

// Filter outbreaks by selected city and update trending diseases list
function filterByCity(city) {
  filteredOutbreaks = allOutbreaks.filter(o => o.city === city);

  // Aggregate diseases by total cases reported in this city
  const diseaseMap = {};
  filteredOutbreaks.forEach(o => {
    const key = o.disease_name || "Unknown";
    diseaseMap[key] = (diseaseMap[key] || 0) + (o.cases_reported || 0);
  });

  trendingDiseases = Object.entries(diseaseMap)
    .sort((a, b) => b[1] - a[1]) // Descending by cases
    .map(entry => ({ name: entry[0], cases: entry[1] }));

  renderDiseaseList();

  // Clear or reset chart
  trendChart && trendChart.destroy();
  selectedDisease = null;
  clearChart();
}

// Render disease list for user to select
function renderDiseaseList() {
  diseaseList.innerHTML = "";
  if (trendingDiseases.length === 0) {
    diseaseList.innerHTML = "<li>No trending diseases in this city.</li>";
    clearChart();
    return;
  }
  trendingDiseases.forEach(disease => {
    const li = document.createElement("li");
    li.textContent = `${disease.name} (${disease.cases} cases)`;
    li.tabIndex = 0;
    li.classList.toggle("selected", disease.name === selectedDisease);
    li.addEventListener("click", () => selectDisease(disease.name));
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        selectDisease(disease.name);
      }
    });
    diseaseList.appendChild(li);
  });

  // Auto-select first disease
  if (!selectedDisease && trendingDiseases.length > 0) {
    selectDisease(trendingDiseases[0].name);
  }
}

// When a disease is selected show the trend chart
function selectDisease(diseaseName) {
  selectedDisease = diseaseName;
  renderDiseaseList();
  renderTrendChart();
}

// Show chart info for selected disease & city
function renderTrendChart() {
  if (!selectedDisease || !filteredOutbreaks.length) {
    clearChart();
    return;
  }

  // Filter data by selected disease
  const diseaseData = filteredOutbreaks.filter(o => o.disease_name === selectedDisease);

  // Aggregate cases by reporting date (day granularity)
  const casesByDate = {};
  diseaseData.forEach(o => {
    const dt = new Date(o.date_reported || o.created_at);
    const dayKey = dt.toISOString().split("T")[0];
    casesByDate[dayKey] = (casesByDate[dayKey] || 0) + (o.cases_reported || 0);
  });

  const labels = Object.keys(casesByDate).sort();
  const cases = labels.map(date => casesByDate[date]);

  // Determine source info (example: show if most reports were user or official)
  const sources = diseaseData.reduce(
    (acc, o) => {
      acc[o.source] = (acc[o.source] || 0) + 1;
      return acc;
    }, {}
  );
  const dominantSource = Object.entries(sources).reduce((a,b) => a[1]>b[1]?a:b, ["none",0])[0];
  sourceInfo.textContent = `Data sourced mainly from: ${dominantSource === "user" ? "Community Reports" : "Official Data"}`;

  // If chart already exists, destroy before creating new one
  if (trendChart) trendChart.destroy();

  trendChart = new Chart(trendChartCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Cases of ${selectedDisease} in ${citySelect.value}`,
        data: cases,
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Date"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Cases Reported"
          }
        }
      }
    }
  });
}

// Clear the chart area if no data
function clearChart() {
  sourceInfo.textContent = "";
  if (trendChart) {
    trendChart.destroy();
    trendChart = null;
  }
  trendChartCtx.clearRect(0, 0, trendChartCtx.canvas.width, trendChartCtx.canvas.height);
}

// Event Listeners
citySelect.addEventListener("change", e => {
  const city = e.target.value;
  if (city) {
    filterByCity(city);
  } else {
    // Clear everything if no city selected
    filteredOutbreaks = [];
    trendingDiseases = [];
    diseaseList.innerHTML = "";
    clearChart();
    document.getElementById("cityMap").textContent = "Map for selected city will appear here (Coming soon)";
  }
});

// Load combined data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadAllOutbreaks();
});
