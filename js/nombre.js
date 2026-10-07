/* ================================================================
   nombre.js — Gestión del nombre del usuario con localStorage
   Práctica 1 · Servicios Telemáticos · UAH

   Se carga en DOS páginas:
     - minombre.html: formulario para guardar el nombre.
     - index.html:    muestra "Hola [nombre]: Bienvenido a Smart Room".

   El script detecta en qué página está según los elementos del DOM.
   ================================================================ */


/* ================================================================
   CONSTANTE: clave usada en localStorage
   Se guarda como pareja clave/valor: "fname" → "Aníbal"
   ================================================================ */
var CLAVE_NOMBRE = "fname";


/* ================================================================
   FUNCIÓN: guardarNombre()
   Se ejecuta al enviar el formulario de minombre.html.
   Guarda el nombre en localStorage.
   ================================================================ */
function guardarNombre(evento) {

    // Evitamos que el formulario recargue la página
    evento.preventDefault();

    var inputNombre   = document.getElementById("fname");
    var mensajeNombre = document.getElementById("mensaje-nombre");

    // .trim() elimina espacios sobrantes al principio y al final
    var nombre = inputNombre.value.trim();

    // Validación: no puede estar vacío
    if (nombre === "") {
        mensajeNombre.textContent = "Introduce un nombre válido.";
        mensajeNombre.className = "mensaje-error";
        return;
    }

    // Comprobamos que el navegador soporta localStorage.
    // En navegadores antiguos, "Storage" no existe.
    if (typeof(Storage) !== "undefined") {
        // localStorage.setItem(clave, valor) guarda el par.
        // Persiste aunque se cierre el navegador (no expira).
        localStorage.setItem(CLAVE_NOMBRE, nombre);

        mensajeNombre.textContent =
            "✓ Nombre guardado: " + nombre + ". Ya puedes volver al inicio.";
        mensajeNombre.className = "mensaje-ok";
    } else {
        mensajeNombre.textContent =
            "Tu navegador no soporta almacenamiento local (localStorage).";
        mensajeNombre.className = "mensaje-error";
    }
}


/* ================================================================
   FUNCIÓN: mostrarNombreEnAside()
   Se ejecuta al cargar index.html.
   Lee el nombre de localStorage y lo muestra en #info-usuario.
   ================================================================ */
function mostrarNombreEnAside() {

    var aside = document.getElementById("info-usuario");

    // Si no existe el aside, estamos en otra página → no hacemos nada
    if (!aside) return;

    // Si el navegador no soporta localStorage, no hacemos nada
    if (typeof(Storage) === "undefined") return;

    // localStorage.getItem(clave) devuelve el valor o null si no existe
    var nombre = localStorage.getItem(CLAVE_NOMBRE);

    if (nombre) {
        // innerHTML permite meter etiquetas HTML dentro del aside
        aside.innerHTML =
            '<p>Hola <strong>' + nombre + '</strong>: Bienvenido a Smart Room</p>';
    }
    // Si no hay nombre guardado, dejamos el "Información" por defecto
}


/* ================================================================
   ARRANQUE: cuando el DOM esté listo, ejecutamos la lógica
   que corresponda a la página actual.
   ================================================================ */

// "DOMContentLoaded" se dispara cuando el HTML está cargado
// (antes de esperar imágenes o CSS).
document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------------
    // Caso minombre.html: existe el formulario
    // ------------------------------------------------------------
    var formNombre = document.getElementById("form-nombre");
    if (formNombre) {
        formNombre.addEventListener("submit", guardarNombre);

        // Rellenamos el campo con el nombre ya guardado (si lo hay)
        if (typeof(Storage) !== "undefined") {
            var guardado = localStorage.getItem(CLAVE_NOMBRE);
            if (guardado) {
                document.getElementById("fname").value = guardado;
            }
        }
    }

    // ------------------------------------------------------------
    // Caso index.html: mostrar el saludo en el aside
    // ------------------------------------------------------------
    mostrarNombreEnAside();
});

