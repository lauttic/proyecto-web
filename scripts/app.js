const menuContainer = document.getElementById("menu-container");
const searchInput = document.getElementById("search-input");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");
const priceSortSelect = document.getElementById("price-sort");

let menuCompleto = [];

fetch('/assets/productos.json')
  .then(response => response.json())
  .then(productos => {
    menuCompleto = productos.menu.flatMap(categoria => categoria.items);  // se forma un array de objetos plano
    renderMenu(menuCompleto);
  })

function renderMenu(items) {
  menuContainer.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="menu-card-content">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <div class="price">$${item.precio}</div>
      </div>
      <button>Agregar</button>
    `;

    menuContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const texto = searchInput.value.toLowerCase();

  const filtrados = menuCompleto.filter(item =>
    item.nombre.toLowerCase().includes(texto)
  );

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
    productosOrdenados.sort((a, b) => a.precio - b.precio);
  } else if (orden === "desc") {
    productosOrdenados.sort((a, b) => b.precio - a.precio);
  }

  renderMenu(productosOrdenados);
});

window.addEventListener("load", () => {
    const modal = document.getElementById("oferta-modal");
    const cerrar = document.querySelector(".cerrar");

    modal.style.display = "flex";

    cerrar.addEventListener("click", () => {
      modal.style.display = "none";
    });
});