/* CONTRASEÑA CORRECTA */
var PASSWORD_CORRECTA = "iroom2026";

/* LISTA DE PAÍSES PERMITIDOS */
var PAISES_PERMITIDOS = ["España", "Francia", "Alemania", "Italia", "Portugal", "Reino Unido", "Países Bajos", "Bélgica", "Suiza", "Estados Unidos", "Canadá", "México", "Argentina", "Brasil", "Japón", "China"];

/* REFERENCIAS DOM */
var inputPais = document.getElementById("pais");
var inputCoordenadas = document.getElementById("coordenadas");
var errorCoordenadas = document.getElementById("error-coordenadas");
var inputPassword = document.getElementById("password");
var indicadorPassword = document.getElementById("indicador-password");
var inputMax = document.getElementById("temp-max");
var inputMin = document.getElementById("temp-min");
var inputActual = document.getElementById("temp-actual");
var outputDiff = document.getElementById("diferencia");
var mensajeTemp = document.getElementById("mensaje-temp");
var formConfig = document.getElementById("form-config");

/* MODAL */
var modal = document.getElementById("modal-error");
var modalMensaje = document.getElementById("modal-mensaje");
var modalCerrar = document.getElementById("modal-cerrar");

/* MOSTRAR Y OCULTAR MODAL USANDO LA CLASE ACTIVO */
function mostrarModal(mensaje) {
    modalMensaje.textContent = mensaje;
    modal.classList.add("activo"); // Activa el CSS display:flex
}

modalCerrar.addEventListener("click", function() {
    modal.classList.remove("activo"); // Vuelve a display:none
});

/* INDICADOR DE CONTRASEÑA */
inputPassword.addEventListener("input", function() {
    var len = inputPassword.value.length;
    if (len === 0) {
        indicadorPassword.textContent = "";
        indicadorPassword.className = "";
    } else if (len < 9) {
        indicadorPassword.textContent = "Longitud: corta (mínimo 9 caracteres)";
        indicadorPassword.className = "mensaje-error";
    } else if (len < 12) {
        indicadorPassword.textContent = "Longitud: adecuada";
        indicadorPassword.className = "mensaje-ok";
    } else {
        indicadorPassword.textContent = "Longitud: buena";
        indicadorPassword.className = "mensaje-ok";
    }
});

/* DIFERENCIA DE TEMPERATURAS */
function actualizarDiferencia() {
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    if (isNaN(max) || isNaN(min)) {
        outputDiff.value = "—";
        return;
    }
    if (max < min) {
        outputDiff.value = "—";
        mensajeTemp.textContent = "Error: máxima menor que mínima.";
        return;
    }
    outputDiff.value = (max - min).toFixed(1);
    mensajeTemp.textContent = "";
}

inputMax.addEventListener("input", actualizarDiferencia);
inputMin.addEventListener("input", actualizarDiferencia);
actualizarDiferencia();

/* CONVERSIÓN DE COORDENADAS */
function parsearCoordenadas(texto) {
    texto = texto.trim();
    
    // Formato decimal: 40.513, -3.3486
    if (texto.indexOf('°') === -1) {
        var partes = texto.split(',');
        if (partes.length !== 2) return null;
        var lat = parseFloat(partes[0].trim().replace(',', '.'));
        var lon = parseFloat(partes[1].trim().replace(',', '.'));
        if (isNaN(lat) || isNaN(lon)) return null;
        return { lat: lat, lon: lon };
    }

    // Formato GMS: N 40° 30' 45.00", O 3° 20' 54.00"
    var regexGMS = /([NS])?\s*(\d+)[°º]\s*(\d+)['′]?\s*([\d.]+)?["″]?\s*,?\s*([EO])?\s*(\d+)[°º]\s*(\d+)['′]?\s*([\d.]+)?["″]?/i;
    var match = texto.match(regexGMS);
    if (!match) return null;

    var latDir = match[1] || "N";
    var latG = parseFloat(match[2]);
    var latM = parseFloat(match[3]);
    var latS = parseFloat(match[4] || 0);
    var lonDir = match[5] || "E";
    var lonG = parseFloat(match[6]);
    var lonM = parseFloat(match[7]);
    var lonS = parseFloat(match[8] || 0);

    var lat = latG + latM/60 + latS/3600;
    var lon = lonG + lonM/60 + lonS/3600;

    if (latDir.toUpperCase() === 'S') lat = -lat;
    if (lonDir.toUpperCase() === 'O' || lonDir.toUpperCase() === 'W') lon = -lon;

    return { lat: lat, lon: lon };
}

/* VALIDACIÓN AL ENVIAR */
formConfig.addEventListener("submit", function(evento) {
    evento.preventDefault();

    // 1. PAÍS
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

    // 2. COORDENADAS
    var coords = parsearCoordenadas(inputCoordenadas.value);
    if (coords === null) {
        mostrarModal("Coordenadas no válidas. Usa formato decimal o GMS.");
        return;
    }
    var urlMaps = "https://maps.google.com/maps?q=" + coords.lat + "," + coords.lon;
    console.log("Enlace a Google Maps:", urlMaps);

    // 3. CONTRASEÑA
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

    // 4. TEMPERATURAS
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    var actual = parseFloat(inputActual.value);
    if (isNaN(max) || isNaN(min)) {
        mostrarModal("Revisa los umbrales de temperatura.");
        return;
    }
    if (max < min) {
        mostrarModal("La temperatura máxima no puede ser menor que la mínima.");
        return;
    }
    if (isNaN(actual)) {
        mostrarModal("Introduce un número válido en la temperatura actual.");
        return;
    }
    if (actual < 22 || actual > 26) {
        mostrarModal("Advertencia: temperatura actual fuera del rango 22-26°C. Se registrará de todos modos.");
    } else {
        mostrarModal("✓ Datos guardados correctamente.");
    }
});
