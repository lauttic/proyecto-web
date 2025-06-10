const menuContainer = document.getElementById("menu-container");
const searchInput = document.getElementById("search-input");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");
const priceSortSelect = document.getElementById("price-sort");

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

  items.forEach(item => {
    const product = item.fields;
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <img src="/${product.Imagen}" alt="${product.Nombre}">
      <div class="menu-card-content">
        <h3>${product.Nombre}</h3>
        <p>${product.Descripción}</p>
        <div class="price">$${product.Precio}</div>
      </div>
      <button class="add-btn" data-id="${product.ID}">Agregar</button>
    `;

    menuContainer.appendChild(card);
  });
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
    section.style.display = section.id === id ? "block" : "none";
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