// Variable global solo para el usuario actual
let currentUser = null;

// Valida que usuario exista en la base de datos
async function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:8091/api/usuarios/');
        const users = await response.json();

        const user = users.find(u => u.correo === email && u.contrasena === password);


        if (user) {
            currentUser = user;
            // Guardar en localStorage para persistencia
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Redirigir según rol a
            if (user.rol === 'Administrador') {
                window.location.href = '../HomeAdm/'; // o el path de home admin
            } else if (user.rol === 'Vendedor') {
                window.location.href = '../HomeVendedor/';
            } else if (user.rol === 'Bodeguero') {
                window.location.href = '../HomeBodeguero/';
            } else if (user.rol === 'Contador') {
                window.location.href = '../HomeContador/';
            } else {
                window.location.href = '../Home/';
            }
        } else {
            showError('loginError', 'Correo o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showError('loginError', 'Error de conexión. Inténtalo de nuevo.');
    }
}

// Create Users
async function createUser() {
    window.location.href = '../CreateUser/';
}

// Mostrar errores
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Mostrar éxito (si quieres usarlo en registro también)
function showSuccess(message) {
    const alertBox = document.getElementById('customSuccess');
    const messageSpan = document.getElementById('successMessage');
    messageSpan.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000); // 3 segundos
}

// Solo si necesitas cargar algo en login (ej: limpiar mensajes)
document.addEventListener('DOMContentLoaded', function () {
    // Aquí no cargues productos ni carrito
});
