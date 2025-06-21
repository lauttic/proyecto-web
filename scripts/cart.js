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

  const cartTotalContainer = document.querySelector(".cart-total");
  const totalText = document.getElementById("total-amount");
  let total = 0;

  if (carrito.cantidad === 0 || carrito.products.length === 0) {
    cartEmptyMsg.style.display = "block";
    if (totalText) totalText.textContent = "Total: $0";
    return;
  } else {
    cartEmptyMsg.style.display = "none";
  }

  carrito.products.forEach((item, index) => {
    const product = item.fields;
    total += product.Precio;

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

  if (totalText) totalText.textContent = `Total: $${total}`;

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

async function eliminarProductoPorID(productId) {
  const recordToDelete = menuCompleto.find(item => item.fields.ID == productId);

  if (!recordToDelete) {
    mostrarModalMensaje("No se encontró el producto con ese ID");
    return;
  }

  mostrarModalConfirmacion("¿Estás seguro que querés eliminar este producto?", async () => {
    try {
      const response = await fetch(`${url}/${recordToDelete.id}`, {
        method: "DELETE",
        headers: headers
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      menuCompleto = menuCompleto.filter(item => item.id !== recordToDelete.id);
      renderMenu(menuCompleto);
      mostrarModalMensaje("Producto eliminado correctamente");

    } catch (error) {
      mostrarModalMensaje("Error al eliminar: " + error.message);
    }
  });
}

function mostrarModalConfirmacion(mensaje, onConfirmar) {
  const modal = document.getElementById("modal-confirmacion");
  const mensajeElem = document.getElementById("modal-confirmacion-mensaje");
  const btnConfirmar = document.getElementById("btn-confirmar");
  const btnCancelar = document.getElementById("btn-cancelar");

  mensajeElem.textContent = mensaje;
  modal.style.display = "flex";

  const cerrar = () => {
    modal.style.display = "none";
    btnConfirmar.removeEventListener("click", confirmar);
    btnCancelar.removeEventListener("click", cerrar);
  };

  const confirmar = () => {
    cerrar();
    onConfirmar();
  };

  btnConfirmar.addEventListener("click", confirmar);
  btnCancelar.addEventListener("click", cerrar);
}

function mostrarModalMensaje(mensaje) {
  const modal = document.getElementById("modal-mensaje");
  const texto = document.getElementById("modal-mensaje-texto");
  const btnOk = document.getElementById("btn-mensaje-ok");

  texto.textContent = mensaje;
  modal.style.display = "flex";

  const cerrar = () => {
    modal.style.display = "none";
    btnOk.removeEventListener("click", cerrar);
  };

  btnOk.addEventListener("click", cerrar);
}

document.querySelector(".finalizar-btn").addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || { cantidad: 0, products: [] };

  if (carrito.products.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

document.getElementById("pedido-modal").style.display = "flex";
});

document.getElementById("enviar-pedido").addEventListener("click", () => {
  const direccion = document.getElementById("direccion").value.trim();
  const pago = document.getElementById("pago").value.trim();

  if (!direccion || !pago) {
    alert("Por favor completá todos los campos.");
    return;
  }

document.getElementById("pedido-modal").style.display = "none";
  document.getElementById("pedido-popup").classList.remove("hidden");

  localStorage.removeItem("carrito");
  actualizarContadorCarrito();
  renderCarrito();
});

document.getElementById("cerrar-popup").addEventListener("click", () => {
  document.getElementById("pedido-popup").classList.add("hidden");
});