// ==========================================
// VARIABLES GLOBALES
// ==========================================
var CLAVE_NOMBRE = "fname"; // Clave para guardar en localStorage

// ==========================================
// LÓGICA DEL NOMBRE (LocalStorage)
// ==========================================
function guardarNombre(evento) {
    evento.preventDefault(); // Evita recargar la página
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

function mostrarNombreEnAside() {
    var aside = document.getElementById("info-usuario");
    if (!aside) return;
    if (typeof(Storage) === "undefined") return;
    
    var nombre = localStorage.getItem(CLAVE_NOMBRE);
    if (nombre) {
        aside.innerHTML = '<p>Hola <strong>' + nombre + '</strong>: Bienvenido a Smart Room</p>';
    }
}

// ==========================================
// VALIDACIÓN DE EMAIL (APARTADO 3)
// ==========================================

// 1. Función SIN expresiones regulares (Manipulación de cadenas)
function validarEmailSinRegex(email) {
    email = email.trim(); // Quitamos espacios por los lados
    
    if (email === "") return false; // No puede estar vacío
    if (email.indexOf(" ") !== -1) return false; // No puede tener espacios en medio

    var partesArroba = email.split("@"); // Cortamos por la arroba
    if (partesArroba.length !== 2) return false; // Debe haber exactamente una arroba

    var usuario = partesArroba[0];
    var dominio = partesArroba[1];

    if (usuario.length === 0 || dominio.length === 0) return false; // Ninguna parte puede estar vacía

    // El dominio debe tener al menos un punto y no puede empezar o terminar con él
    if (dominio.indexOf(".") === -1) return false;
    if (dominio.startsWith(".") || dominio.endsWith(".")) return false;
    if (dominio.indexOf("..") !== -1) return false;


    return true; // Si pasa todas las pruebas, es válido
}

// 2. Función CON expresiones regulares
function validarEmailConRegex(email) {
    email = email.trim();
    // ^[^\s@]+ : Texto inicial (ni espacio ni @)
    // @ : Arroba
    // [^\s@]+ : Dominio (ni espacio ni @)
    // \. : Punto
    // [^\s@]+$ : Extensión (ni espacio ni @)
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (dominio.indexOf("..") !== -1) return false;
    return regex.test(email);
}

// ==========================================
// ASIGNACIÓN DE EVENTOS AL CARGAR EL DOM
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    
    // --- Lógica del nombre ---
    var formNombre = document.getElementById("form-nombre");
    if (formNombre) {
        formNombre.addEventListener("submit", guardarNombre);
    }
    mostrarNombreEnAside();

    // --- Lógica del email ---
    var btnSinRegex = document.getElementById("btn-sin-regex");
    var btnConRegex = document.getElementById("btn-con-regex");
    var inputEmail = document.getElementById("email");
    var mensajeEmail = document.getElementById("mensaje-email");

    if (btnSinRegex && btnConRegex) {
        // Botón 1: Sin Regex
        btnSinRegex.addEventListener("click", function() {
            if (validarEmailSinRegex(inputEmail.value)) {
                mensajeEmail.textContent = "✓ Válido (Sin Regex)";
                mensajeEmail.className = "mensaje-ok";
            } else {
                mensajeEmail.textContent = "✗ Inválido (Sin Regex)";
                mensajeEmail.className = "mensaje-error";
            }
        });

        // Botón 2: Con Regex
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



