// ==========================================
// CONFIGURACIÓN Y VARIABLES INICIALES
// ==========================================

var PASSWORD_CORRECTA = "iroom2026";
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

function mostrarModal(mensaje) {
    modalMensaje.textContent = mensaje;
    modal.classList.add("activo");
}

modalCerrar.addEventListener("click", function() {
    modal.classList.remove("activo");
});

// ==========================================
// VALIDACIÓN EN TIEMPO REAL (MIENTRAS ESCRIBES)
// ==========================================

// Indicador de longitud de contraseña
inputPassword.addEventListener("input", function() {
    var len = inputPassword.value.length;
    if (len === 0) {
        indicadorPassword.textContent = "";
        indicadorPassword.className = "";
    } else if (len < 9) {
        indicadorPassword.textContent = "Evaluación de longitud: Corta (mínimo 9 caracteres)";
        indicadorPassword.className = "mensaje-error";
    } else {
        indicadorPassword.textContent = "Evaluación de longitud: Adecuada";
        indicadorPassword.className = "mensaje-ok";
    }
});

// Cálculo automático de la diferencia de temperaturas
function actualizarDiferencia() {
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    if (isNaN(max) || isNaN(min) || max < min) {
        outputDiff.value = "—";
    } else {
        outputDiff.value = (max - min).toFixed(1);
    }
}
inputMax.addEventListener("input", actualizarDiferencia);
inputMin.addEventListener("input", actualizarDiferencia);
actualizarDiferencia(); // Llamada inicial

// ==========================================
// FUNCIÓN APARTADO 2: PARSEAR COORDENADAS
// ==========================================
// Recibe el texto del usuario y devuelve un objeto {lat, lon} o null si falla
function parsearCoordenadas(texto) {
    texto = texto.trim();
    if (texto === "") return null;

    var lat = 0;
    var lon = 0;

    // 1. ¿Es formato decimal? (No tiene el símbolo de grados)
    if (texto.indexOf('º') === -1 && texto.indexOf('º') === -1) {
        var partes = texto.split(',');
        if (partes.length !== 2) return null; // Tiene que haber una coma
        
        lat = parseFloat(partes[0].trim().replace(',', '.'));
        lon = parseFloat(partes[1].trim().replace(',', '.'));
        
        if (isNaN(lat) || isNaN(lon)) return null;
        
        return { lat: lat, lon: lon };
    }

    // 2. ¿Es formato GMS? (Grados, minutos, segundos)
    // Esta expresión regular busca: una letra (N/S), grados, minutos, segundos, coma, letra (E/O), grados, minutos, segundos.
    var regexGMS = /([NS])?\s*(\d+)[°º]\s*(\d+)['′]?\s*([\d.]+)?["″]?\s*,?\s*([EO])?\s*(\d+)[°º]\s*(\d+)['′]?\s*([\d.]+)?["″]?/i;
    var match = texto.match(regexGMS);
    
    if (!match) return null;

    // Extraemos los datos de la expresión regular
    var latDir = match[1] || "N"; // Si no pone N o S, por defecto Norte
    var latG = parseFloat(match[2]);
    var latM = parseFloat(match[3]);
    var latS = parseFloat(match[4] || 0); // Si no hay segundos, 0

    var lonDir = match[5] || "E"; // Si no pone E u O, por defecto Este
    var lonG = parseFloat(match[6]);
    var lonM = parseFloat(match[7]);
    var lonS = parseFloat(match[8] || 0);

    // Fórmula matemática: Grados + (Minutos / 60) + (Segundos / 3600)
    lat = latG + (latM / 60) + (latS / 3600);
    lon = lonG + (lonM / 60) + (lonS / 3600);

    // Si es Sur (S) u Oeste (O o W), el valor es negativo
    if (latDir.toUpperCase() === 'S') lat = -lat;
    if (lonDir.toUpperCase() === 'O' || lonDir.toUpperCase() === 'W') lon = -lon;

    return { lat: lat, lon: lon };
}


// ==========================================
// VALIDACIONES AL PULSAR "ENVIAR"
// ==========================================

formConfig.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evitamos que la página se recargue

    // ----------------------------------------
    // 1. VALIDAR PAÍS
    // ----------------------------------------
    var paisVal = inputPais.value.trim().toLowerCase();
    var paisValido = false;
    
    for (var i = 0; i < PAISES_PERMITIDOS.length; i++) {
        if (PAISES_PERMITIDOS[i].toLowerCase() === paisVal) {
            paisValido = true;
            break;
        }
    }
    
    if (!paisValido) {
        mostrarModal("País no válido. Debe ser uno de la lista.");
        return;
    }

    // ----------------------------------------
    // 2. VALIDAR COORDENADAS Y GENERAR ENLACE
    // ----------------------------------------
    var coords = parsearCoordenadas(inputCoordenadas.value);
    
    if (coords === null) {
        mostrarModal("Coordenadas no válidas. Usa 'lat, lon' o 'N 40° 30' 45, O 3° 20' 54'.");
        return;
    }

    // Creamos la URL de Google Maps con el orden: latitud, longitud
    var urlMaps = "https://maps.google.com/maps?q=" + coords.lat + "," + coords.lon;
    
    // Lo pintamos en el div que preparamos en el HTML
    var divEnlace = document.getElementById("enlace-maps");
    if (divEnlace) {
        divEnlace.innerHTML = '<a href="' + urlMaps + '" target="_blank">📍 Ver ubicación en Google Maps</a>';
    }

    // ----------------------------------------
    // 3. VALIDAR CONTRASEÑA
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
    // 4. VALIDAR TEMPERATURAS
    // ----------------------------------------
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    var actual = parseFloat(inputActual.value);

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
        mostrarModal("Advertencia: temperatura actual fuera del rango 22-26°C. Se registrará de todos modos.");
    } else {
        mostrarModal("✓ Datos guardados correctamente y enlace de Maps generado.");
    }
});

