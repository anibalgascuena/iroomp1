var valorActual = "0";
var valorAnterior = "";
var operacionActual = null;
var unidadActual = "C"; // C, K o F

function actualizarDisplay() {
    document.getElementById("resultado").textContent = valorActual;
    
    var textoUnidad = "Unidad: Celsius (°C)";
    if (unidadActual === "K") textoUnidad = "Unidad: Kelvin (K)";
    if (unidadActual === "F") textoUnidad = "Unidad: Fahrenheit (°F)";
    document.getElementById("unidad-actual").textContent = textoUnidad;
}

function agregarNumero(num) {
    if (num === "." && valorActual.includes(".")) return;
    
    if (valorActual === "0" && num !== ".") {
        valorActual = num;
    } else {
        valorActual += num;
    }
    actualizarDisplay();
}

function elegirOperacion(op) {
    if (valorActual === "") return;
    if (valorAnterior !== "") calcular();
    
    operacionActual = op;
    valorAnterior = valorActual;
    valorActual = "";
}

function calcular() {
    if (operacionActual === null || valorAnterior === "" || valorActual === "") return;
    
    var num1 = parseFloat(valorAnterior);
    var num2 = parseFloat(valorActual);
    var resultado = 0;
    
    if (operacionActual === "+") resultado = num1 + num2;
    if (operacionActual === "-") resultado = num1 - num2;
    if (operacionActual === "*") resultado = num1 * num2;
    if (operacionActual === "/") resultado = num1 / num2;
    
    valorActual = resultado.toString();
    operacionActual = null;
    valorAnterior = "";
    actualizarDisplay();
}

function limpiar() {
    valorActual = "0";
    valorAnterior = "";
    operacionActual = null;
    actualizarDisplay();
}

// FUNCIÓN EXTRA: CONVERSIÓN DE UNIDADES
function convertir(destino) {
    var valor = parseFloat(valorActual);
    if (isNaN(valor)) return;

    // Primero pasamos todo a Celsius
    var celsius = valor;
    if (unidadActual === "K") celsius = valor - 273.15;
    if (unidadActual === "F") celsius = (valor - 32) * 5 / 9;

    // Ahora convertimos de Celsius al destino
    var resultado = celsius;
    if (destino === "K") resultado = celsius + 273.15;
    if (destino === "F") resultado = (celsius * 9 / 5) + 32;

    // Redondeamos a 2 decimales
    valorActual = (Math.round(resultado * 100) / 100).toString();
    unidadActual = destino;
    actualizarDisplay();
}
