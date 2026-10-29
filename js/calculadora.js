// ==========================================
// VARIABLES DE ESTADO DE LA CALCULADORA
// ==========================================
var valorActual = "0";       // Lo que se ve en pantalla
var valorAnterior = "";      // El número de antes de pulsar un operador
var operacionActual = null;  // Guarda +, -, *, /
var unidadActual = "C";      // C=Celsius, K=Kelvin, F=Fahrenheit

// ==========================================
// FUNCIÓN PARA ACTUALIZAR LA PANTALLA
// ==========================================
function actualizarDisplay() {
    document.getElementById("resultado").textContent = valorActual;
    
    // Actualizamos el texto de la unidad según corresponda
    var textoUnidad = "Unidad: Celsius (°C)";
    if (unidadActual === "K") textoUnidad = "Unidad: Kelvin (K)";
    if (unidadActual === "F") textoUnidad = "Unidad: Fahrenheit (°F)";
    
    document.getElementById("unidad-actual").textContent = textoUnidad;
}

// ==========================================
// LÓGICA DE LOS BOTONES NUMÉRICOS
// ==========================================
function agregarNumero(num) {
    // Evitamos que se pongan dos puntos decimales
    if (num === "." && valorActual.includes(".")) return;
    
    // Si la pantalla está en 0 y no es un punto, reemplazamos el 0
    if (valorActual === "0" && num !== ".") {
        valorActual = num;
    } else {
        valorActual += num; // Si no, concatenamos el número
    }
    actualizarDisplay();
}

// ==========================================
// LÓGICA DE LAS OPERACIONES MATEMÁTICAS
// ==========================================
function elegirOperacion(op) {
    if (valorActual === "") return;
    
    // Si ya había una operación pendiente, la resolvemos primero
    if (valorAnterior !== "") calcular();
    
    operacionActual = op;
    valorAnterior = valorActual;
    valorActual = ""; // Limpiamos la pantalla para el siguiente número
}

function calcular() {
    // Si falta algún dato, no hacemos nada
    if (operacionActual === null || valorAnterior === "" || valorActual === "") return;
    
    var num1 = parseFloat(valorAnterior);
    var num2 = parseFloat(valorActual);
    var resultado = 0;
    
    if (operacionActual === "+") resultado = num1 + num2;
    if (operacionActual === "-") resultado = num1 - num2;
    if (operacionActual === "*") resultado = num1 * num2;
    
    // Controlamos la división por cero
    if (operacionActual === "/") {
        if (num2 === 0) {
            valorActual = "Error";
            operacionActual = null;
            valorAnterior = "";
            actualizarDisplay();
            return;
        }
        resultado = num1 / num2;
    }
    
    // EL TRUCO: Redondeamos a 3 decimales máximo y quitamos ceros sobrantes
    valorActual = parseFloat(resultado.toFixed(3)).toString();
    
    operacionActual = null;
    valorAnterior = "";
    actualizarDisplay();
}

// ==========================================
// FUNCIÓN PARA LIMPIAR (BOTÓN C)
// ==========================================
function limpiar() {
    valorActual = "0";
    valorAnterior = "";
    operacionActual = null;
    actualizarDisplay();
}

// ==========================================
// FUNCIÓN EXTRA: CONVERSIÓN DE UNIDADES
// ==========================================
function convertir(destino) {
    var valor = parseFloat(valorActual);
    if (isNaN(valor)) return; // Si no hay un número válido, salimos

    // 1. PRIMER PASO: Convertir todo a Celsius
    var celsius = valor;
    if (unidadActual === "K") celsius = valor - 273.15;
    if (unidadActual === "F") celsius = (valor - 32) * 5 / 9;

    // 2. SEGUNDO PASO: Convertir de Celsius a la unidad destino
    var resultado = celsius;
    if (destino === "K") resultado = celsius + 273.15;
    if (destino === "F") resultado = (celsius * 9 / 5) + 32;

    // Redondeamos a 2 decimales para las temperaturas
    valorActual = parseFloat(resultado.toFixed(2)).toString();
    
    // Actualizamos la unidad actual
    unidadActual = destino;
    
    // Refrescamos la pantalla
    actualizarDisplay();
}

