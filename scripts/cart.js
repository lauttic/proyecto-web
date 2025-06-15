const cartItemsContainer = document.getElementById("cart-items");
const cartEmptyMsg = document.getElementById("cart-empty");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const id = Number(e.target.dataset.id); 

    const productoSeleccionado = menuCompleto.find(item => item.fields.ID === id);
    if (productoSeleccionado) {
      agregarAlCarrito(productoSeleccionado);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  renderCarrito();
});

document.querySelector(".btn-cancel").addEventListener("click", () => {
  mostrarSeccion("home");
});

function agregarAlCarrito(productoSimple) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };
  carrito.cantidad += 1;
  carrito.products.push(productoSimple);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito(); 
  renderCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };
  const contador = document.getElementById("cart-count");
  
  if (!contador) return;

  if (carrito.cantidad > 0) {
    contador.textContent = carrito.cantidad;
    contador.style.display = "inline-block";
  } else {
    contador.style.display = "none";
  }
}

function renderCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };

  cartItemsContainer.innerHTML = "";

  if (carrito.cantidad === 0 || carrito.products.length === 0) {
    cartEmptyMsg.style.display = "block";
    return;
  } else {
    cartEmptyMsg.style.display = "none";
  }

  carrito.products.forEach((item, index) => {
    const product = item.fields;

    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <img src="./${product.Imagen}" alt="${product.Nombre}">
      <div class="menu-card-content">
        <h3>${product.Nombre}</h3>
        <p>${product.Descripción}</p>
        <div class="price">$${product.Precio}</div>
      </div>
      <button class="remove-btn" data-index="${index}">Eliminar</button>
    `;

    cartItemsContainer.appendChild(card);
  });

  const removeButtons = cartItemsContainer.querySelectorAll(".remove-btn");
  removeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = Number(e.target.dataset.index);
      eliminarDelCarrito(idx);
    });
  });
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };

  if (index >= 0 && index < carrito.products.length) {
    carrito.products.splice(index, 1);
    carrito.cantidad = carrito.products.length;

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderCarrito();
  }
}

function abrirEdicion(productId) {
  const productObj = menuCompleto.find(item => item.fields.ID == productId);
  if (!productObj) return alert("Producto no encontrado");

  const product = productObj.fields;

  document.querySelector(".input-id").value = product.ID;
  document.querySelector(".input-nombre").value = product.Nombre;
  document.querySelector(".input-descripcion").value = product.Descripción;
  document.querySelector(".input-precio").value = product.Precio;
  document.querySelector(".input-imagen").value = product.Imagen;

  mostrarSeccion("edit-product");
}