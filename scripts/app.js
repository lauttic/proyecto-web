console.log("Hola")

fetch('../assets/productos.json')
.then(response => response.json()) // Convierte la respuesta en un objeto JavaScript
.then(productos => {console.log(productos)})