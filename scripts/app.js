const menuContainer = document.getElementById("menu-container");

fetch('/assets/productos.json')
  .then(response => response.json())
  .then(productos => {
    renderMenu(productos);
    console.log(productos)
  })
  .catch(error => {
    console.error("Error al cargar el menú:", error);
  });

function renderMenu(menuData) {
  menuData.menu.forEach(categoria => {
    categoria.items.forEach(item => {
        console.log(item)
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

// ---- NAVEGACIÓN DINÁMICA ----
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");

function mostrarSeccion(id) {
  sections.forEach(section => {
    section.style.display = section.id === id ? "block" : "none";
  });
}

// Ocultamos todo menos "home" al cargar
mostrarSeccion("home");

// Asignamos los eventos a los links
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const sectionId = link.getAttribute("data-section");
    mostrarSeccion(sectionId);

    // (opcional) marcar como activo
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});