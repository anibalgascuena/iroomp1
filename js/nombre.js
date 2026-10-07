/* CLAVE de localStorage. Se guarda "fname" → "Aníbal". */
var CLAVE_NOMBRE = "fname";

/* FUNCIÓN: guarda el nombre al enviar el formulario de minombre.html. */
function guardarNombre(evento) {
    evento.preventDefault();  // Evita recargar la página.

    var inputNombre   = document.getElementById("fname");
    var mensajeNombre = document.getElementById("mensaje-nombre");

    var nombre = inputNombre.value.trim();  // .trim() quita espacios sobrantes.

    if (nombre === "") {
        mensajeNombre.textContent = "Introduce un nombre válido.";
        mensajeNombre.className = "mensaje-error";
        return;
    }

    if (typeof(Storage) !== "undefined") {  // ¿Soporta localStorage?
        localStorage.setItem(CLAVE_NOMBRE, nombre);  // Guarda el par clave/valor.
        mensajeNombre.textContent = "✓ Nombre guardado: " + nombre + ". Ya puedes volver al inicio.";
        mensajeNombre.className = "mensaje-ok";
    } else {
        mensajeNombre.textContent = "Tu navegador no soporta almacenamiento local.";
        mensajeNombre.className = "mensaje-error";
    }
}

/* FUNCIÓN: lee el nombre de localStorage y lo muestra en el aside. */
function mostrarNombreEnAside() {
    var aside = document.getElementById("info-usuario");
    if (!aside) return;                          // No estamos en index.html.
    if (typeof(Storage) === "undefined") return; // Sin localStorage.

    var nombre = localStorage.getItem(CLAVE_NOMBRE);  // Lee el valor o null.
    if (nombre) {
        aside.innerHTML = '<p>Hola <strong>' + nombre + '</strong>: Bienvenido a Smart Room</p>';
    }
    // Si no hay nombre, se queda el "Información" por defecto.
}

/* ARRANQUE: al cargar el DOM, ejecuta la lógica correspondiente. */
document.addEventListener("DOMContentLoaded", function () {

    // Caso minombre.html
    var formNombre = document.getElementById("form-nombre");
    if (formNombre) {
        formNombre.addEventListener("submit", guardarNombre);
        // Rellena el campo con el nombre ya guardado (si existe).
        if (typeof(Storage) !== "undefined") {
            var guardado = localStorage.getItem(CLAVE_NOMBRE);
            if (guardado) {
                document.getElementById("fname").value = guardado;
            }
        }
    }

    // Caso index.html
    mostrarNombreEnAside();
});
