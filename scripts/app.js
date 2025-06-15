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
      <img src="./${product.Imagen}" alt="${product.Nombre}">
      <div class="menu-card-content">
        <h3>${product.Nombre}</h3>
        <p>${product.Descripción}</p>
        <div class="price">$${product.Precio}</div>
      </div>
      ${loggedIn ? `<button class="edit-btn" data-id="${product.ID}">Editar</button>` : `<button class="add-btn" data-id="${product.ID}">Agregar</button>`}
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

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idProducto = document.querySelector(".input-id").value;
  const nombre = document.querySelector(".input-nombre").value.trim();
  const descripcion = document.querySelector(".input-descripcion").value.trim();
  const precio = parseFloat(document.querySelector(".input-precio").value);
  const imagen = document.querySelector(".input-imagen").value.trim();

  const recordToUpdate = menuCompleto.find(item => item.fields.ID == idProducto);

  if (!recordToUpdate) {
    return alert("No se encontró el producto para actualizar");
  }

  const recordId = recordToUpdate.id;

  const updateData = {
    fields: {
      Nombre: nombre,
      Descripción: descripcion,
      Precio: precio,
      Imagen: imagen
    }
  };

  try {
    const response = await fetch(`${url}/${recordId}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

    const updatedRecord = await response.json();

    const index = menuCompleto.findIndex(item => item.id === recordId);
    if (index !== -1) {
      menuCompleto[index] = updatedRecord;
    }

    alert("Producto actualizado correctamente");

    mostrarSeccion("home");
    renderMenu(menuCompleto);

  } catch (error) {
    alert("Error al actualizar el producto: " + error.message);
  }
});
