const menuContainer = document.getElementById("menu-container");
const searchInput = document.getElementById("search-input");
const navLinks = document.querySelectorAll("header a[data-section]");
const sections = document.querySelectorAll("main section");
const priceSortSelect = document.getElementById("price-sort");
const editForm = document.querySelector(".edit-product-form");

// AIRTABLE
const baseId = 'appmPHgEdsk4lQoQo';
const tableName = "Products";
const apiKey = 'pat2115ywOX7HW3bl.c375ae6e12f43929ad6e8bc7099818cd03a30df492881529c789c3b7b7861a9c';
const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

const headers = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

let menuCompleto = [];

getAllRecords();

function estaLogueado() {
  return !!localStorage.getItem("usuarioLogueado");
}

async function getAllRecords() {
  const res = await fetch(url, {
    headers: headers
  });

  const dataProduct = await res.json();
  const sortedRecords = dataProduct.records.sort((a, b) => {
    return a.fields.ID - b.fields.ID;
  });
  menuCompleto = sortedRecords;
  renderMenu(sortedRecords);
}

function renderMenu(items) {
  menuContainer.innerHTML = "";

  const loggedIn = estaLogueado();
  items.forEach(item => {
    const product = item.fields;
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <img src="${product.Imagen.startsWith('http') ? product.Imagen : './' + product.Imagen}" alt="${product.Nombre}">
      <div class="menu-card-content">
        <h3>${product.Nombre}</h3>
        <p>${product.Descripción}</p>
        <div class="price">$${product.Precio}</div>
      </div>
      <div class="btns-product">
      ${loggedIn ? `<button class="edit-btn" data-id="${product.ID}">Editar producto</button><button class="delete-btn" data-id="${product.ID}">Eliminar producto</button>` : `<button class="add-btn" data-id="${product.ID}">Agregar</button>`}
      </div>
    `
    menuContainer.appendChild(card);
  });

  if (loggedIn) {
    const editButtons = menuContainer.querySelectorAll(".edit-btn");
    editButtons.forEach(button => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id");
        abrirEdicion(productId);
      });
    });
  }

  if (loggedIn) {
    const deleteButtons = menuContainer.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id");
        eliminarProductoPorID(productId);
      });
    });
  }

  if (loggedIn) {
    document.getElementById("admin-controls").style.display = "block";
  } else {
    document.getElementById("admin-controls").style.display = "none";
  }
}

searchInput.addEventListener("input", () => {
  const texto = searchInput.value.toLowerCase();
  const filtrados = menuCompleto.filter(item => {
    const product = item.fields;
    return product.Nombre.toLowerCase().includes(texto)
  });
  renderMenu(filtrados);
});

function mostrarSeccion(id) {
  sections.forEach(section => {
    if (section.id === id) {
      section.style.display = id === "login" ? "flex" : "block";
    } else {
      section.style.display = "none";
    }
  });
}

function mostrarModalNuevoError(mensaje) {
  const modal = document.getElementById("modal-nuevo-error");
  const texto = document.getElementById("modal-nuevo-error-texto");
  const btnOk = document.getElementById("btn-nuevo-error-ok");

  texto.textContent = mensaje;
  modal.style.display = "flex";

  const cerrar = () => {
    modal.style.display = "none";
    btnOk.removeEventListener("click", cerrar);
  };

  btnOk.addEventListener("click", cerrar);
}

function mostrarModalNuevoExito(callback) {
  const modal = document.getElementById("modal-nuevo-exito");
  const btnOk = document.getElementById("btn-nuevo-exito-ok");

  modal.style.display = "flex";

  const cerrar = () => {
    modal.style.display = "none";
    btnOk.removeEventListener("click", cerrar);
    if (callback) callback();
  };

  btnOk.addEventListener("click", cerrar);
}

mostrarSeccion("home");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const sectionId = link.getAttribute("data-section");
    mostrarSeccion(sectionId);

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

priceSortSelect.addEventListener("change", () => {
  const orden = priceSortSelect.value;

  let productosOrdenados = [...menuCompleto];

  if (orden === "asc") {
    productosOrdenados.sort((a, b) => a.fields.Precio - b.fields.Precio);
  } else if (orden === "desc") {
    productosOrdenados.sort((a, b) => b.fields.Precio - a.fields.Precio);
  }

  renderMenu(productosOrdenados);
});

window.addEventListener("load", () => {
  const modal = document.getElementById("oferta-modal");
  const cerrar = document.querySelector(".close");

  modal.style.display = "flex";

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

document.getElementById("form-nuevo-producto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nuevo-nombre").value.trim();
  const descripcion = document.getElementById("nuevo-descripcion").value.trim();
  const precio = parseFloat(document.getElementById("nuevo-precio").value);
  const urlImagen = document.getElementById("nuevo-imagen").value.trim();

  function esUrlValida(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const imagenFinal = esUrlValida(urlImagen) ? urlImagen : "https://via.placeholder.com/150";

  if (!nombre || !descripcion || isNaN(precio)) {
    mostrarModalNuevoError("Completa todos los campos correctamente");
    return;
  }

  const ultimoID = menuCompleto.reduce((max, item) => {
    return item.fields.ID > max ? item.fields.ID : max;
  }, 0);

  const nuevoID = ultimoID + 1;

  const nuevoProducto = {
    fields: {
      ID: nuevoID,
      Nombre: nombre,
      Descripción: descripcion,
      Precio: precio,
      Imagen: imagenFinal,
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(nuevoProducto),
    });

    if (!response.ok) {
      throw new Error("Error al agregar producto");
    }

    const data = await response.json();
    menuCompleto.push(data);

    document.getElementById("modal-nuevo-producto").style.display = "none";
    e.target.reset();
    renderMenu(menuCompleto);

    mostrarModalNuevoExito();

  } catch (error) {
    mostrarModalNuevoError("Error: " + error.message);
  }
});

document.getElementById("btn-nuevo-producto").addEventListener("click", () => {
  document.getElementById("modal-nuevo-producto").style.display = "flex";
});

document.getElementById("cerrar-nuevo-producto").addEventListener("click", () => {
  document.getElementById("modal-nuevo-producto").style.display = "none";
});

function esUrlValida(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}