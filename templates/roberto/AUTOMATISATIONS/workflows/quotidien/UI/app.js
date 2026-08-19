const list = document.getElementById("project-list");
const saveButton = document.getElementById("save-button");
const statusMessage = document.getElementById("status-message");

let projects = [];
let draggedIndex = null;

function render() {
  list.innerHTML = "";
  projects.forEach((project, index) => {
    const row = document.createElement("div");
    row.className = "project-row";
    row.draggable = true;
    row.dataset.index = String(index);

    row.innerHTML = `
      <span class="project-rank">${index + 1}</span>
      <span class="project-handle">::</span>
      <span class="project-name">${project.nom}</span>
      <span class="project-alias">${project.alias}</span>
    `;

    row.addEventListener("dragstart", () => {
      draggedIndex = index;
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over");
    });
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drag-over");
      if (draggedIndex === null || draggedIndex === index) return;
      const [moved] = projects.splice(draggedIndex, 1);
      projects.splice(index, 0, moved);
      draggedIndex = null;
      render();
    });

    list.appendChild(row);
  });
}

async function load() {
  const response = await fetch("/order");
  const data = await response.json();
  projects = data.projects;
  render();
}

saveButton.addEventListener("click", async () => {
  statusMessage.textContent = "Enregistrement...";
  const response = await fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects }),
  });
  statusMessage.textContent = response.ok ? "Ordre enregistré." : "Erreur d'enregistrement.";
});

load();
