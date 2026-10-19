/* CLAVE de localStorage */
var CLAVE_NOMBRE = "fname";

/* FUNCIÓN: guardar nombre */
function guardarNombre(evento) {
    evento.preventDefault();
    var inputNombre = document.getElementById("fname");
    var mensajeNombre = document.getElementById("mensaje-nombre");
    var nombre = inputNombre.value.trim();

    if (nombre === "") {
        mensajeNombre.textContent = "Introduce un nombre válido.";
        mensajeNombre.className = "mensaje-error";
        return;
    }

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(CLAVE_NOMBRE, nombre);
        mensajeNombre.textContent = "✓ Nombre guardado: " + nombre;
        mensajeNombre.className = "mensaje-ok";
    } else {
        mensajeNombre.textContent = "Tu navegador no soporta almacenamiento local.";
        mensajeNombre.className = "mensaje-error";
    }
}

/* FUNCIÓN: mostrar nombre en aside */
function mostrarNombreEnAside() {
    var aside = document.getElementById("info-usuario");
    if (!aside) return;
    if (typeof(Storage) === "undefined") return;
    var nombre = localStorage.getItem(CLAVE_NOMBRE);
    if (nombre) {
        aside.innerHTML = '<p>Hola <strong>' + nombre + '</strong>: Bienvenido a Smart Room</p>';
    }
}

/* =========================================================
   VALIDACIÓN DE EMAIL (APARTADO 3)
   ========================================================= */

/* FUNCIÓN 1: Sin expresiones regulares (usando operaciones de cadena) */
function validarEmailSinRegex(email) {
    email = email.trim();
    if (email === "") return false;
    
    // No puede tener espacios
    if (email.indexOf(" ") !== -1) return false;

    // Debe tener exactamente un @
    var partesArroba = email.split("@");
    if (partesArroba.length !== 2) return false;

    var usuario = partesArroba[0];
    var dominio = partesArroba[1];

    // La parte del usuario no puede estar vacía
    if (usuario.length === 0) return false;

    // El dominio no puede estar vacío
    if (dominio.length === 0) return false;

    // El dominio debe contener al menos un punto
    if (dominio.indexOf(".") === -1) return false;

    // El punto no puede ser el primer o último carácter del dominio
    if (dominio.startsWith(".") || dominio.endsWith(".")) return false;

    return true;
}

/* FUNCIÓN 2: Con expresión regular */
function validarEmailConRegex(email) {
    email = email.trim();
    // ^[^\s@]+ -> Inicio, uno o más caracteres que no sean espacio ni @
    // @ -> Una @
    // [^\s@]+ -> Uno o más caracteres que no sean espacio ni @ (dominio)
    // \. -> Un punto literal
    // [^\s@]+$ -> Uno o más caracteres que no sean espacio ni @ (TLD)
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* EVENTOS DE LOS BOTONES DE VALIDACIÓN */
document.addEventListener("DOMContentLoaded", function () {
    // Lógica del nombre
    var formNombre = document.getElementById("form-nombre");
    if (formNombre) {
        formNombre.addEventListener("submit", guardarNombre);
    }
    mostrarNombreEnAside();

    // Lógica del email
    var btnSinRegex = document.getElementById("btn-sin-regex");
    var btnConRegex = document.getElementById("btn-con-regex");
    var inputEmail = document.getElementById("email");
    var mensajeEmail = document.getElementById("mensaje-email");

    if (btnSinRegex && btnConRegex) {
        btnSinRegex.addEventListener("click", function() {
            if (validarEmailSinRegex(inputEmail.value)) {
                mensajeEmail.textContent = "✓ Válido (Sin Regex)";
                mensajeEmail.className = "mensaje-ok";
            } else {
                mensajeEmail.textContent = "✗ Inválido (Sin Regex)";
                mensajeEmail.className = "mensaje-error";
            }
        });

        btnConRegex.addEventListener("click", function() {
            if (validarEmailConRegex(inputEmail.value)) {
                mensajeEmail.textContent = "✓ Válido (Con Regex)";
                mensajeEmail.className = "mensaje-ok";
            } else {
                mensajeEmail.textContent = "✗ Inválido (Con Regex)";
                mensajeEmail.className = "mensaje-error";
            }
        });
    }
});
