const API_BASE = "http://localhost:8000/api";


async function loadHotOutbreaks() {
  try {
    const response = await fetch(`${API_BASE}/outbreaks`);
    const data = await response.json();
    const container = document.getElementById("hotOutbreaks");

    console.log("Fetched outbreaks:", data);
    
    if (!Array.isArray(data) || data.length === 0) {
  container.innerHTML = "<p>No outbreak data available currently.</p>";
  return;
}

container.innerHTML = ""; // Clear loading message



data.forEach(trend => {
  const div = document.createElement("div");
  div.classList.add("outbreak");

  // Use trend.count or trend.cases_reported, depending on your schema
  const count = trend.cases_reported;
  if (count > 10) {
    div.style.backgroundColor = "#ff7f7f";
  } else if (count > 3) {
    div.style.backgroundColor = "#ffecb3";
  } else {
    div.style.backgroundColor = "#b9e6ba";
  }

  // Disease name: use trend.disease_name if available
  const name = trend.disease_name ?? "Unknown";
  div.textContent = `${name}: ${count} recent cases`;
  container.appendChild(div);
});

  } catch (error) {
    document.getElementById("hotOutbreaks").innerText = "Error loading outbreak data.";
  }
}