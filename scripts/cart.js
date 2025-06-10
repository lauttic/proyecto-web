document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const id = Number(e.target.dataset.id); 

    const productoSeleccionado = menuCompleto.find(item => item.fields.ID === id);
    if (productoSeleccionado) {
      agregarAlCarrito(productoSeleccionado);
    }
  }
});


function agregarAlCarrito(productoSimple) {
  // Leer carrito o crear uno vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };

  // Aumentar la cantidad total
  carrito.cantidad += 1;

  // Agregar el producto (objeto) al array products
  carrito.products.push(productoSimple);

  // Guardar el carrito actualizado
  localStorage.setItem("carrito", JSON.stringify(carrito));

  console.log("Carrito actualizado:", carrito);
}