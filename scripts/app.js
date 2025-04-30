const menuContainer = document.getElementById("menu-container");

fetch('../assets/productos.json')
  .then(response => response.json())
  .then(productos => {
    // Ahora sí tenemos los datos, renderizamos el menú
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