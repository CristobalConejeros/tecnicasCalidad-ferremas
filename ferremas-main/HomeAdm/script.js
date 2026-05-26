// script.js para administrador en HomeAdm

let currentUser = null;
let products = [];
let cart = [];

// Mostrar vista
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName).classList.add('active');

    if (viewName === 'registerProduct' || viewName === 'editProduct') {
        loadCategorias();
    }
}

// Cargar productos desde API
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8091/api/productos/');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
        products = [];
    }
}

// Mostrar productos como tarjetas editables
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div style="width: 100%; aspect-ratio: 1 / 1; overflow: hidden; border-radius: 10px; margin-bottom: 10px;">
              <img src="../Archivos/${product.imagen}" alt="${product.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h3>${product.nombre}</h3>
            <p><strong>Marca:</strong> ${product.marca}</p>
            <p><strong>Descripción:</strong> ${product.descripcion}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Precio:</strong> $${product.precio.toLocaleString('es-CL')}</p>
            <p><strong>Estado:</strong> ${product.estado}</p>
            <button class="btn btn-success" onclick="editProduct(${product.id})">Editar</button>
        `;
        productGrid.appendChild(card);
    });
}

// Mostrar datos en formulario de edición
async function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 1. Cargar categorías antes de asignar la actual
    await loadCategorias();

    // 2. Rellenar el formulario con los datos del producto
    document.getElementById('editId').value = product.id;
    document.getElementById('editNombre').value = product.nombre;
    document.getElementById('editDescripcion').value = product.descripcion;
    document.getElementById('editMarca').value = product.marca;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editPrecio').value = product.precio;
    document.getElementById('editEstado').value = product.estado;
    document.getElementById('editImagen').value = product.imagen;

    // 3. Seleccionar la categoría actual
    if (product.categoria && product.categoria.id) {
        document.getElementById('editCategoria').value = product.categoria.id;
    }

    // 4. Mostrar vista
    showView('editProductView');
}
// Enviar edición al servidor
async function updateProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('editId').value;
    const updatedProduct = {
        nombre: document.getElementById('editNombre').value.trim(),
        descripcion: document.getElementById('editDescripcion').value.trim(),
        marca: document.getElementById('editMarca').value.trim(),
        stock: parseInt(document.getElementById('editStock').value),
        precio: parseFloat(document.getElementById('editPrecio').value),
        estado: document.getElementById('editEstado').value.trim(),
        imagen: document.getElementById('editImagen').value.trim(),
        id_categoria: parseInt(document.getElementById('editCategoria').value)
    };

    try {
        const response = await fetch(`http://localhost:8090/api/productos/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            showSuccess('Producto actualizado correctamente.');
            loadProducts();
            showView('products');
        } else {
            const errorText = await response.text();
            showError('editProductError', 'Error al actualizar producto: ' + errorText);
        }
    } catch (error) {
        showError('editProductError', 'Error de conexión: ' + error.message);
    }
}

// Crear nuevo producto
async function createProduct(event) {
    event.preventDefault();

    const productData = {
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        marca: document.getElementById('marca').value.trim(),
        stock: parseInt(document.getElementById('stock').value),
        precio: parseFloat(document.getElementById('precio').value),
        estado: document.getElementById('estado').value.trim(),
        imagen: document.getElementById('imagen').value.trim(),
        id_categoria: parseInt(document.getElementById('categoria').value)
    };

    console.log("Datos a enviar:", productData);  // <-- Aquí

    try {
        const response = await fetch('http://localhost:8091/api/productos/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showSuccess('Producto registrado correctamente.');
            document.getElementById('productForm').reset();
            loadProducts();
            showView('products');
        } else {
            const errorText = await response.text();
            showError('productError', 'Error al registrar producto: ' + errorText);
        }
    } catch (error) {
        showError('productError', 'Error de conexión: ' + error.message);
    }
}


async function loadCategorias() {
    try {
        const response = await fetch('http://localhost:8091/api/categorias/');
        const categorias = await response.json();

        const ids = ['categoria', 'editCategoria'];
        ids.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Seleccione una categoría</option>';
                categorias.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.nombre;
                    select.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}
// Mostrar éxito
function showSuccess(message) {
    const alertBox = document.getElementById('customSuccess');
    const messageSpan = document.getElementById('successMessage');
    messageSpan.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => alertBox.style.display = 'none', 3000);
}

// Mostrar error
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) {
        alert(message);
        return;
    }
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    location.href = '../Login/';
}

// Inicializar app
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        location.href = '../Login/';
        return;
    }

    currentUser = user;
    document.getElementById('userWelcome').textContent = `Bienvenido, ${user.nombre}`;
    document.getElementById('homeWelcome').textContent = `Bienvenido ${user.nombre} a Ferremas`;
    document.getElementById('userWelcome').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'inline';

    if (user.rol && user.rol.toLowerCase() === 'administrador') {
        document.getElementById('btnRegisterProduct').style.display = 'block';
    } else {
        document.getElementById('btnRegisterProduct').style.display = 'none';
    }

    loadProducts();

    // Detectar si viene ?view=products en la URL
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view) {
        showView(view);
    }
});