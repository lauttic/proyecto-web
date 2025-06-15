const loginForm = document.getElementById("login-form");
const error = document.getElementById("login-error");
const userInfo = document.getElementById("user-info");
const nombreUsuarioSpan = document.getElementById("nombre-usuario");
const logoutBtn = document.getElementById("logout-btn");
const loginContainer = document.querySelector(".login-container");

function mostrarUsuarioLogueado(nombre) {
  loginForm.style.display = "none";
  loginContainer.style.display = "none";
  userInfo.style.display = "block";
  nombreUsuarioSpan.textContent = nombre;
  getAllRecords();
}

function ocultarUsuarioLogueado() {
  loginForm.style.display = "block";
  loginContainer.style.display = "block";
  userInfo.style.display = "none";
  getAllRecords();
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("username").value;
  const clave = document.getElementById("password").value;

  if (usuario === "admin" && clave === "1234") {
    localStorage.setItem("usuarioLogueado", JSON.stringify({ nombre: usuario }));
    mostrarUsuarioLogueado(usuario);
    error.style.display = "none";
    mostrarSeccion('home');
  } else {
    error.style.display = "block";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogueado");
  ocultarUsuarioLogueado();
  mostrarSeccion("login"); 
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (user) {
    mostrarUsuarioLogueado(user.nombre);
  } else {
    ocultarUsuarioLogueado();
  }
});
