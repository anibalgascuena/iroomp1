// ==========================================
// CONFIGURACIÓN Y VARIABLES INICIALES
// ==========================================

// Contraseña que consideramos válida
var PASSWORD_CORRECTA = "iroom2026";

// Lista de países permitidos (tal y como pide el Apartado 1)
var PAISES_PERMITIDOS = ["España", "Francia", "Alemania", "Italia", "Portugal", "Reino Unido", "Países Bajos", "Bélgica", "Suiza", "Estados Unidos", "Canadá", "México", "Argentina", "Brasil", "Japón", "China"];

// Referencias a los elementos del HTML
var formConfig = document.getElementById("form-config");
var inputPais = document.getElementById("pais");
var inputCoordenadas = document.getElementById("coordenadas");
var inputPassword = document.getElementById("password");
var indicadorPassword = document.getElementById("indicador-password");
var inputMax = document.getElementById("temp-max");
var inputMin = document.getElementById("temp-min");
var inputActual = document.getElementById("temp-actual");
var outputDiff = document.getElementById("diferencia");
var mensajeTemp = document.getElementById("mensaje-temp");

// Variables del Modal
var modal = document.getElementById("modal-error");
var modalMensaje = document.getElementById("modal-mensaje");
var modalCerrar = document.getElementById("modal-cerrar");

// ==========================================
// FUNCIONES DEL MODAL
// ==========================================

// Función para mostrar la ventana modal con un mensaje
function mostrarModal(mensaje) {
    modalMensaje.textContent = mensaje;
    modal.classList.add("activo"); // Añade la clase CSS para que se vea
}

// Evento para cerrar el modal al pulsar "Aceptar"
modalCerrar.addEventListener("click", function() {
    modal.classList.remove("activo"); // Quita la clase y lo oculta
});

// ==========================================
// VALIDACIÓN EN TIEMPO REAL (MIENTRAS ESCRIBES)
// ==========================================

// 1. Indicador de longitud de contraseña
inputPassword.addEventListener("input", function() {
    var len = inputPassword.value.length;
    
    if (len === 0) {
        indicadorPassword.textContent = "";
        indicadorPassword.className = "";
    } else if (len < 9) {
        // Menos de 9: Rojo (Mensaje de error)
        indicadorPassword.textContent = "Evaluación de longitud: Corta (mínimo 9 caracteres)";
        indicadorPassword.className = "mensaje-error";
    } else {
        // 9 o más: Verde (Mensaje OK)
        indicadorPassword.textContent = "Evaluación de longitud: Adecuada";
        indicadorPassword.className = "mensaje-ok";
    }
});

// 2. Cálculo automático de la diferencia de temperaturas
function actualizarDiferencia() {
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    
    if (isNaN(max) || isNaN(min) || max < min) {
        outputDiff.value = "—";
        mensajeTemp.textContent = "";
    } else {
        outputDiff.value = (max - min).toFixed(1);
        mensajeTemp.textContent = "";
    }
}

inputMax.addEventListener("input", actualizarDiferencia);
inputMin.addEventListener("input", actualizarDiferencia);
actualizarDiferencia(); // Llamada inicial

// ==========================================
// VALIDACIONES AL PULSAR "ENVIAR"
// ==========================================

formConfig.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evitamos que la página se recargue

    // ----------------------------------------
    // 1. VALIDAR PAÍS
    // ----------------------------------------
    // Quitamos espacios con trim() y pasamos a minúsculas con toLowerCase()
    var paisVal = inputPais.value.trim().toLowerCase();
    var paisValido = false;
    
    // Comprobamos si está en la lista
    for (var i = 0; i < PAISES_PERMITIDOS.length; i++) {
        if (PAISES_PERMITIDOS[i].toLowerCase() === paisVal) {
            paisValido = true;
            break;
        }
    }
    
    if (!paisValido) {
        mostrarModal("País no válido. Debe ser uno de la lista.");
        return; // Cortamos la ejecución aquí
    }

    // ----------------------------------------
    // 2. VALIDAR CONTRASEÑA
    // ----------------------------------------
    if (inputPassword.value.length < 9) {
        mostrarModal("La contraseña debe tener al menos 9 caracteres.");
        return;
    }
    if (inputPassword.value !== PASSWORD_CORRECTA) {
        mostrarModal("Contraseña incorrecta.");
        inputPassword.value = "";
        inputPassword.focus();
        return;
    }

    // ----------------------------------------
    // 3. VALIDAR TEMPERATURAS
    // ----------------------------------------
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    var actual = parseFloat(inputActual.value);

    // Errores de formato
    if (isNaN(max) || isNaN(min)) {
        mostrarModal("Revisa los umbrales de temperatura. Deben ser números.");
        return;
    }
    if (max < min) {
        mostrarModal("La temperatura máxima no puede ser menor que la mínima.");
        return;
    }
    if (isNaN(actual) || inputActual.value === "") {
        mostrarModal("Introduce un número válido en la temperatura actual.");
        return;
    }

    // Advertencia fuera de rango (NO bloquea el envío)
    if (actual < 22 || actual > 26) {
        // Mostramos el modal pero NO hacemos 'return'
        mostrarModal("Advertencia: temperatura actual fuera del rango 22-26°C. Se registrará de todos modos.");
    } else {
        // Si está en rango, mostramos el éxito
        mostrarModal("✓ Datos guardados correctamente.");
    }
})
