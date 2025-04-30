const menuContainer = document.getElementById("menu-container");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");
console.log(sections)

fetch('/assets/productos.json')
  .then(response => response.json())
  .then(productos => {
    renderMenu(productos);
  })
  .catch(error => {
    console.error("Error al cargar el menú:", error);
  });

function renderMenu(menuData) {
  menuData.menu.forEach(categoria => {
    categoria.items.forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";


      card.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <div class="price">$${item.precio}</div>
        <button>Agregar</button>
      `;

      menuContainer.appendChild(card);
    });
  });
}

function mostrarSeccion(id) {
  sections.forEach(section => {
    section.style.display = section.id === id ? "block" : "none";
  });
}

mostrarSeccion("home");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();  // evita que recargue la pagina
    const sectionId = link.getAttribute("data-section");
    mostrarSeccion(sectionId);

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});