const API_URL = "http://127.0.0.1:5000/incidents";
    const form = document.getElementById("incident-form");
const body = document.getElementById("incident-body");

function cargarIncidentes() {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener datos");
        return res.json();
      })
      .then(data => {
        console.log("Datos recibidos:", data); // ✅ Verificar datos en consola
        body.innerHTML = "";
        data.forEach(i => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${i.id}</td>
            <td>${i.reporter}</td>
            <td>${i.description}</td>
            <td>${i.status}</td>
            <td>${i.created_at}</td>
            <td>
              <select onchange="actualizarStatus(${i.id}, this.value)">
                <option disabled selected>Cambiar</option>
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En proceso</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </td>
            <td><button onclick="eliminar(${i.id})">Eliminar</button></td>
          `;
          body.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Hubo un error al cargar los incidentes:", err);
      });
  }
  

form.addEventListener("submit", e => {
  e.preventDefault();
  const reporter = document.getElementById("reporter").value;
  const description = document.getElementById("description").value;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reporter, description })
  })
  .then(res => res.json())
  .then(() => {
    form.reset();
    cargarIncidentes();
  });
});

function eliminar(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  }).then(() => cargarIncidentes());
}

function actualizarStatus(id, nuevoEstado) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: nuevoEstado })
  }).then(() => cargarIncidentes());
}

cargarIncidentes();
