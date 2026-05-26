// Cambiar entre vistas
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
}

// Cargar usuarios
async function loadUsers() {
    try {
        const res = await fetch('http://localhost:8091/api/usuarios/');
        const users = await res.json();
        const container = document.getElementById('userTableContainer');

        let html = '<div class="user-grid">';
        users.forEach(u => {
            html += `
                <div class="user-card">
                    <h3>${u.nombre}</h3>
                    <p><strong>Correo:</strong> ${u.correo}</p>
                    <p><strong>Teléfono:</strong> ${u.telefono || '-'}</p>
                    <p><strong>Rol:</strong> ${u.rol}</p>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    } catch (err) {
        console.error('Error cargando usuarios:', err);
        container.innerHTML = '<p>Error al cargar usuarios.</p>';
    }
}

// Registrar usuario
async function registerUser(event) {
    event.preventDefault();
    const user = {
        rut: document.getElementById('rut').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        contrasena: document.getElementById('password').value.trim(),
        rol: document.getElementById('rol').value
    };
    try {
        const res = await fetch('http://localhost:8091/api/usuarios/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        });
        if (res.ok) {
            showSuccess('Usuario creado correctamente.');
            showView('userListView');
            loadUsers();
        } else {
            const txt = await res.text();
            showError('createUserError', 'Error: ' + txt);
        }
    } catch (err) {
        showError('createUserError', 'Error de conexión');
    }
}

function showSuccess(message) {
    const el = document.getElementById('customSuccess');
    document.getElementById('successMessage').textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    showView('userListView');
    loadUsers();
});