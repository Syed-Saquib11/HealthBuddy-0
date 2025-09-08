// DOM elements
const diseaseList = document.getElementById("diseaseList");
const searchInput = document.getElementById("searchInput");
const detailSection = document.getElementById("diseaseDetail");
const diseaseName = document.getElementById("diseaseName");
const diseaseDescription = document.getElementById("diseaseDescription");
const symptomList = document.getElementById("symptomList");
const preventionText = document.getElementById("preventionText");
const treatmentText = document.getElementById("treatmentText");
const closeDetailBtn = document.getElementById("closeDetail");

// Store diseases data globally after first fetch
let diseases = [];

// Render the list of diseases with optional filtering
function renderDiseaseList(filter = "") {
  diseaseList.innerHTML = "";
  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    diseaseList.innerHTML = "<li>No diseases found.</li>";
    return;
  }

  filtered.forEach(disease => {
    const li = document.createElement("li");
    li.textContent = disease.name;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => showDiseaseDetail(disease));
    diseaseList.appendChild(li);
  });
}

// Show detailed info about a disease
function showDiseaseDetail(disease) {
  diseaseName.textContent = disease.name;
  diseaseDescription.textContent = disease.description;

  symptomList.innerHTML = "";
  disease.symptoms.forEach(symptom => {
    const li = document.createElement("li");
    li.textContent = symptom;
    symptomList.appendChild(li);
  });

  preventionText.textContent = disease.prevention;
  treatmentText.textContent = disease.treatment;

  detailSection.style.display = "block";
}

// Close detail section and show disease list
closeDetailBtn.addEventListener("click", () => {
  detailSection.style.display = "none";
});

// Load diseases on page load and render list
async function loadDiseases() {
  const response = await fetch("data/common-diseases.json");
  diseases = await response.json();
  renderDiseaseList();
}
loadDiseases();

// Filter diseases on search input change
searchInput.addEventListener("input", e => {
  renderDiseaseList(e.target.value);
});
