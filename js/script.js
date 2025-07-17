let modoEdicion = false;
let indiceEdicion = null;

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();
  agregarEvento();
});

function agregarEvento() {
  limpiarErrores();

  const titulo = document.getElementById("titulo").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const lugar = document.getElementById("lugar").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!titulo || !fecha || !lugar || !descripcion) {
    if (!titulo)
      document.getElementById("error-titulo").textContent = "El título del evento es obligatorio.";
    if (!fecha)
      document.getElementById("error-fecha").textContent = "La fecha del evento es obligatoria.";
    if (!lugar)
      document.getElementById("error-lugar").textContent = "El lugar del evento es obligatorio.";
    if (!descripcion)
      document.getElementById("error-descripcion").textContent = "La descripción es obligatoria.";
    return;
  }

  const nuevoEvento = { titulo, fecha, lugar, descripcion };
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");

  if (modoEdicion) {
    eventos[indiceEdicion] = nuevoEvento;
    modoEdicion = false;
    indiceEdicion = null;
    document.querySelector("#formulario button[type='submit']").textContent = "Agregar Evento";
  } else {
    eventos.push(nuevoEvento);
  }

  localStorage.setItem("eventos", JSON.stringify(eventos));
  document.getElementById("formulario").reset();
  mostrarEventos();
}

function mostrarEventos() {
  const lista = document.getElementById("listaEventos");
  lista.innerHTML = "";
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");

  eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  eventos.forEach((e, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row";

    li.innerHTML = `
      <div>
        <strong>${e.titulo}</strong> - ${formatearFecha(e.fecha)}<br>
        <em>Lugar:</em> ${e.lugar}<br>
        <em>Descripción:</em> ${e.descripcion}
      </div>
      <div class="mt-2 mt-md-0">
        <button class="btn btn-warning btn-sm me-2" onclick="cargarParaEditar(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminar(${index})">Eliminar</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

function cargarParaEditar(index) {
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  const evento = eventos[index];

  document.getElementById("titulo").value = evento.titulo;
  document.getElementById("fecha").value = evento.fecha;
  document.getElementById("lugar").value = evento.lugar;
  document.getElementById("descripcion").value = evento.descripcion;

  modoEdicion = true;
  indiceEdicion = index;

  document.querySelector("#formulario button[type='submit']").textContent = "Actualizar Evento";
}

function eliminar(index) {
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  eventos.splice(index, 1);
  localStorage.setItem("eventos", JSON.stringify(eventos));
  mostrarEventos();
}

function limpiarErrores() {
  document.querySelectorAll(".mensaje-error").forEach((el) => (el.textContent = ""));
}

function formatearFecha(fechaISO) {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fechaISO).toLocaleDateString("es-CL", opciones);
}

window.onload = mostrarEventos;
