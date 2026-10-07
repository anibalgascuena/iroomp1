/* CONTRASEÑA CORRECTA. En un caso real estaría en el servidor. */
var PASSWORD_CORRECTA = "iroom2026";

/* REFERENCIAS A ELEMENTOS DEL DOM (para no buscarlos cada vez). */
var inputMax      = document.getElementById("temp-max");
var inputMin      = document.getElementById("temp-min");
var outputDiff    = document.getElementById("diferencia");
var mensajeTemp   = document.getElementById("mensaje-temp");
var inputPassword = document.getElementById("password");
var mensajeEnvio  = document.getElementById("mensaje-envio");
var formConfig    = document.getElementById("form-config");

/* FUNCIÓN: recalcula la diferencia entre temperatura máxima y mínima. */
function actualizarDiferencia() {
    var max = parseFloat(inputMax.value);  // parseFloat convierte texto a número.
    var min = parseFloat(inputMin.value);

    if (isNaN(max) || isNaN(min)) {        // Si alguno no es número...
        outputDiff.value = "—";
        mensajeTemp.textContent = "Introduce valores numéricos válidos.";
        return;
    }

    if (max < min) {                       // Validación: máx debe ser ≥ mín.
        outputDiff.value = "—";
        mensajeTemp.textContent = "Error: la temperatura máxima no puede ser menor que la mínima.";
        return;
    }

    var diferencia = max - min;
    outputDiff.value = diferencia.toFixed(1);  // Redondea a 1 decimal.
    mensajeTemp.textContent = "";              // Limpia el error.
}

/* EVENTOS: cada cambio en un umbral recalcula la diferencia. */
inputMax.addEventListener("input", actualizarDiferencia);
inputMin.addEventListener("input", actualizarDiferencia);
inputMax.addEventListener("change", actualizarDiferencia);
inputMin.addEventListener("change", actualizarDiferencia);

actualizarDiferencia();  // Llamada inicial para mostrar el valor por defecto.

/* EVENTO: envío del formulario. */
formConfig.addEventListener("submit", function (evento) {
    evento.preventDefault();  // Evita que la página se recargue.

    mensajeEnvio.textContent = "";
    mensajeEnvio.className = "";

    // VALIDACIÓN 1: temperaturas
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);
    if (isNaN(max) || isNaN(min) || max < min) {
        mensajeEnvio.textContent = "Revisa los umbrales de temperatura antes de enviar.";
        mensajeEnvio.className = "mensaje-error";
        return;
    }

    // VALIDACIÓN 2: contraseña
    if (inputPassword.value !== PASSWORD_CORRECTA) {
        mensajeEnvio.textContent = "Contraseña incorrecta. Inténtalo de nuevo.";
        mensajeEnvio.className = "mensaje-error";
        inputPassword.value = "";
        inputPassword.focus();
        return;
    }

    // TODO CORRECTO
    mensajeEnvio.textContent = "✓ Datos guardados correctamente. La configuración se ha actualizado.";
    mensajeEnvio.className = "mensaje-ok";
});
