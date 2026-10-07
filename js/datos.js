/* ================================================================
   datos.js — Lógica del formulario de configuración
   Práctica 1 · Servicios Telemáticos · UAH

   Responsabilidades:
     1. Calcular la diferencia entre temperatura máxima y mínima
        cada vez que cambian los umbrales.
     2. Validar que la temperatura máxima sea ≥ la mínima.
     3. Al enviar el formulario:
        - Comprobar que la contraseña es correcta.
        - Mostrar mensaje de éxito o error.
   ================================================================ */


/* ================================================================
   CONSTANTE: contraseña correcta
   En un caso real esto estaría en el servidor. Aquí simulamos
   la autenticación en el cliente (la práctica lo permite).
   ================================================================ */
var PASSWORD_CORRECTA = "iroom2026";


/* ================================================================
   REFERENCIAS A LOS ELEMENTOS DEL DOM
   Obtenemos los elementos por su id para poder leerlos y
   modificarlos desde JavaScript.
   ================================================================ */
var inputMax      = document.getElementById("temp-max");
var inputMin      = document.getElementById("temp-min");
var outputDiff    = document.getElementById("diferencia");
var mensajeTemp   = document.getElementById("mensaje-temp");
var inputPassword = document.getElementById("password");
var mensajeEnvio  = document.getElementById("mensaje-envio");
var formConfig    = document.getElementById("form-config");


/* ================================================================
   FUNCIÓN: actualizarDiferencia()
   Lee los dos umbrales, calcula la diferencia y la muestra
   en el <output>. También valida que máx ≥ mín.
   ================================================================ */
function actualizarDiferencia() {

    // .value devuelve texto; parseFloat lo convierte a número decimal.
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);

    // Si alguno no es un número válido, no hacemos nada
    if (isNaN(max) || isNaN(min)) {
        outputDiff.value = "—";
        mensajeTemp.textContent = "Introduce valores numéricos válidos.";
        return;
    }

    // Validación: la temperatura máxima debe ser mayor o igual a la mínima
    if (max < min) {
        outputDiff.value = "—";
        mensajeTemp.textContent =
            "Error: la temperatura máxima no puede ser menor que la mínima.";
        return;
    }

    // Si todo está bien, calculamos la diferencia
    var diferencia = max - min;

    // Redondeamos a 1 decimal para evitar 9.99999...
    outputDiff.value = diferencia.toFixed(1);

    // Limpiamos el mensaje de error
    mensajeTemp.textContent = "";
}


/* ================================================================
   EVENTOS: cada vez que cambia un umbral, recalculamos
   "input" se dispara al teclear; "change" al perder el foco.
   Usamos ambos para que se actualice en tiempo real.
   ================================================================ */
inputMax.addEventListener("input", actualizarDiferencia);
inputMin.addEventListener("input", actualizarDiferencia);
inputMax.addEventListener("change", actualizarDiferencia);
inputMin.addEventListener("change", actualizarDiferencia);

// Llamamos una vez al cargar para inicializar el <output>
actualizarDiferencia();


/* ================================================================
   EVENTO: envío del formulario
   Se dispara al pulsar el botón submit o al pulsar Enter.
   ================================================================ */
formConfig.addEventListener("submit", function (evento) {

    // Evitamos que el navegador recargue la página
    // (por defecto, un <form> hace una petición HTTP al enviar)
    evento.preventDefault();

    // Limpiamos mensajes anteriores
    mensajeEnvio.textContent = "";
    mensajeEnvio.className = "";

    // ------------------------------------------------------------
    // VALIDACIÓN 1: temperaturas
    // ------------------------------------------------------------
    var max = parseFloat(inputMax.value);
    var min = parseFloat(inputMin.value);

    if (isNaN(max) || isNaN(min) || max < min) {
        mensajeEnvio.textContent =
            "Revisa los umbrales de temperatura antes de enviar.";
        mensajeEnvio.className = "mensaje-error";
        return;
    }

    // ------------------------------------------------------------
    // VALIDACIÓN 2: contraseña
    // Comparamos con la constante PASSWORD_CORRECTA.
    // En un caso real esto se haría en el servidor.
    // ------------------------------------------------------------
    if (inputPassword.value !== PASSWORD_CORRECTA) {
        mensajeEnvio.textContent = "Contraseña incorrecta. Inténtalo de nuevo.";
        mensajeEnvio.className = "mensaje-error";
        inputPassword.value = "";
        inputPassword.focus();
        return;
    }

    // ------------------------------------------------------------
    // TODO CORRECTO: mostramos mensaje de éxito
    // ------------------------------------------------------------
    mensajeEnvio.textContent =
        "✓ Datos guardados correctamente. La configuración se ha actualizado.";
    mensajeEnvio.className = "mensaje-ok";

    // (Opcional en el futuro) aquí podríamos usar localStorage
    // para guardar los datos y mostrarlos en index.html.
});

