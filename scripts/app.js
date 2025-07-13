const menuContainer = document.getElementById("menu-container");
const searchInput = document.getElementById("search-input");
const navLinks = document.querySelectorAll("header a[data-section]");
const sections = document.querySelectorAll("main section");
const priceSortSelect = document.getElementById("price-sort");
const openBtn = document.getElementById('open-filters');
const closeBtn = document.getElementById('close-filters');
const sidenav = document.getElementById('sidenav');
const applyBtn = document.getElementById("apply-filters");
const clearBtn = document.getElementById("clear-filters");

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

applyBtn.addEventListener("click", () => {
  const searchText = searchInput.value.toLowerCase();
  const selectedPrice = priceSortSelect.value;
  const minPrice = parseFloat(document.getElementById("min-price").value);
  const maxPrice = parseFloat(document.getElementById("max-price").value);

  let filtrados = [...menuCompleto];

  // Filtrar por nombre
  if (searchText) {
    filtrados = filtrados.filter(item =>
      item.fields.Nombre.toLowerCase().includes(searchText)
    );
  }

  // Filtrar por precio mínimo
  if (!isNaN(minPrice)) {
    filtrados = filtrados.filter(item =>
      item.fields.Precio >= minPrice
    );
  }

  // Filtrar por precio máximo
  if (!isNaN(maxPrice)) {
    filtrados = filtrados.filter(item =>
      item.fields.Precio <= maxPrice
    );
  }

  // Ordenar por precio
  if (selectedPrice === "asc") {
    filtrados.sort((a, b) => a.fields.Precio - b.fields.Precio);
  } else if (selectedPrice === "desc") {
    filtrados.sort((a, b) => b.fields.Precio - a.fields.Precio);
  }

  renderMenu(filtrados);
  sidenav.classList.remove("open");
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

window.addEventListener("load", () => {
  const modal = document.getElementById("oferta-modal");
  const cerrar = document.querySelector(".close");

  modal.style.display = "flex";

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  priceSortSelect.value = "";
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  if (minPriceInput) minPriceInput.value = "";
  if (maxPriceInput) maxPriceInput.value = "";

  renderMenu(menuCompleto);
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

document.querySelector(".edit-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.querySelector(".input-id").value;
  const nombre = document.querySelector(".input-nombre").value.trim();
  const descripcion = document.querySelector(".input-descripcion").value.trim();
  const precio = parseFloat(document.querySelector(".input-precio").value);
  const imagen = document.querySelector(".input-imagen").value.trim();

  if (!nombre || !descripcion || isNaN(precio)) {
    mostrarModalMensaje("Por favor completá todos los campos correctamente.");
    return;
  }

  const registro = menuCompleto.find(item => item.fields.ID == id);
  if (!registro) {
    mostrarModalMensaje("Producto no encontrado.");
    return;
  }

  const recordAirtableId = registro.id;

  const productoEditado = {
    fields: {
      Nombre: nombre,
      Descripción: descripcion,
      Precio: precio,
      Imagen: imagen
    }
  };

  try {
    const response = await fetch(`${url}/${recordAirtableId}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(productoEditado)
    });

    if (!response.ok) throw new Error("Error al editar el producto");

    const dataActualizada = await response.json();

    // Actualizar en memoria
    menuCompleto = menuCompleto.map(item =>
      item.id === recordAirtableId ? dataActualizada : item
    );

    renderMenu(menuCompleto);
    mostrarSeccion("menu");
    mostrarModalMensaje("Producto editado correctamente.");
  } catch (error) {
    mostrarModalMensaje("Error al editar: " + error.message);
  }
});

 openBtn.addEventListener('click', () => {
    sidenav.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    sidenav.classList.remove('open');
  });

function esUrlValida(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}