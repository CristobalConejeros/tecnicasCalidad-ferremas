// Variables globales
let currentUser = null;
let products = [];
let cart = [];
let categorias = [];
let filteredCategoryId = null;

let exchangeRates = {
    USD: 1,
    EUR: 1
};
let currentCurrency = 'CLP';
// Variable global para controlar si SDK ya está cargado
let paypalSdkLoaded = false;

function loadPaypalSdk(currency) {
    return new Promise((resolve, reject) => {
        // Si ya hay un script cargado, eliminarlo para cargar otro con moneda diferente
        const existingScript = document.getElementById('paypal-sdk');
        if (existingScript) {
            existingScript.remove();
            paypalSdkLoaded = false;
        }

        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        script.src = `https://www.paypal.com/sdk/js?client-id=AWm2rv3u7f9sU8bnxEfgS86JjwvFGSRehtM5XyYf3XQtMTWW6COErZe2bjJkpmlHfqUW5DZgfOYT7EfF&currency=${currency}`;
        script.onload = () => {
            paypalSdkLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('Error cargando SDK PayPal'));
        document.body.appendChild(script);
    });
}

async function loadCategoriasFiltro() {
    try {
        const response = await fetch('http://localhost:8091/api/categorias/');
        categorias = await response.json();
        const list = document.getElementById('categoryFilter');
        list.innerHTML = '';

        categorias.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<button onclick="filterByCategory(${cat.id})" class="btn btn-light" style="margin-bottom: 5px; width: 100%;">${cat.nombre}</button>`;
            list.appendChild(li);
        });
    } catch (e) {
        console.error('Error cargando categorías:', e);
    }
}

function filterByCategory(categoriaId) {
    filteredCategoryId = categoriaId;
    displayProducts();
}

// Mostrar vista
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName).classList.add('active');
}

// Cargar productos desde la API
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8091/api/productos/');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Productos de ejemplo si la API no está disponible
        products = [
            {
                id: 1,
                nombre: "Taladro Percutor 18V",
                imagen: "",
                descripcion: "Taladro inalámbrico con percutor, incluye batería y cargador",
                marca: "DeWalt",
                stock: 15,
                precio: 89990,
                estado: "Disponible"
            },
            {
                id: 2,
                nombre: "Martillo Carpintero 16oz",
                imagen: "",
                descripcion: "Martillo de carpintero con mango de fibra de vidrio",
                marca: "Stanley",
                stock: 45,
                precio: 12490,
                estado: "Disponible"
            },
            {
                id: 3,
                nombre: "Tornillos Autorroscantes 6x40mm",
                imagen: "",
                descripcion: "Caja de 100 unidades de tornillos autorroscantes galvanizados",
                marca: "Hilti",
                stock: 120,
                precio: 3850,
                estado: "Disponible"
            }
        ];
        displayProducts();
    }
}

// Mostrar productos
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products
        .filter(product => !filteredCategoryId || (product.categoria && product.categoria.id === filteredCategoryId))
        .forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                    <div style="width: 100%; aspect-ratio: 1 / 1; overflow: hidden; border-radius: 10px; margin-bottom: 10px;">
                        <img src="../Archivos/${product.imagen}" alt="${product.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <h3>${product.nombre}</h3>
                    <p><strong>Marca:</strong> ${product.marca}</p>
                    <p>${product.descripcion}</p>
                    <div class="price">${formatPrice(product.precio)}</div>
                    <div class="stock">Stock: ${product.stock} unidades</div>
                    <div class="product-controls">
                        <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="${product.stock}">
                        <button class="btn" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                    </div>
                `;
            productGrid.appendChild(productCard);
        });
}

// Agregar al carrito
function addToCart(productId) {
    if (!currentUser) {
        showError('loginError', 'Debes iniciar sesión para agregar productos al carrito');
        showView('login');
        return;
    }

    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);

    if (quantity > product.stock) {
        alert('No hay suficiente stock disponible');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCartDisplay();
    showSuccess('¡Producto agregado al carrito!');
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');
    const btnPay = document.getElementById('btnPay');

    cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 50px;">Tu carrito está vacío</p>';
        cartTotal.style.display = 'none';
        btnPay.style.display = 'none';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.precio * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
                    <div>
                        <h4>${item.nombre}</h4>
                        <p>Cantidad: ${item.quantity} | Precio unitario: ${formatPrice(item.precio)}</p>
                        <p><strong>Subtotal: ${formatPrice(itemTotal)}</strong></p>
                    </div>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Eliminar</button>
                `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: ${formatPrice(total)}`;
    cartTotal.style.display = 'block';
    btnPay.style.display = 'block';
}

// Borrar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Obtener tipos de cambio desde mindicador.cl
async function fetchExchangeRates() {
    try {
        const res = await fetch('https://mindicador.cl/api');
        const data = await res.json();
        exchangeRates.USD = data.dolar.valor;
        exchangeRates.EUR = data.euro.valor;
        console.log('Tipos de cambio cargados:', exchangeRates);
    } catch (error) {
        console.error('Error al obtener tipo de cambio:', error);
    }
}

// Cambiar moneda seleccionada
function changeCurrency() {
    currentCurrency = document.getElementById('currencySelect').value;
    displayProducts();
    updateCartDisplay();
}

// Formatear precio según moneda
function formatPrice(priceCLP) {
    if (currentCurrency === 'CLP') {
        return `$${priceCLP.toLocaleString('es-CL')}`;
    } else if (currentCurrency === 'USD') {
        const usd = (priceCLP / exchangeRates.USD).toFixed(2);
        return `US$${usd}`;
    } else if (currentCurrency === 'EUR') {
        const eur = (priceCLP / exchangeRates.EUR).toFixed(2);
        return `€${eur}`;
    }
}

// Métodos de pago con PayPal, adaptado para moneda seleccionada
async function processPayment() {
    if (cart.length === 0) {
        showSuccess('El carrito está vacío, agrega productos antes de pagar.');
        return;
    }

    const totalCLP = cart.reduce((total, item) => total + item.precio * item.quantity, 0);
    let totalForPay = 0;
    let currencyCode = currentCurrency;
    if (currentCurrency === 'CLP') {
        currencyCode = 'USD'; // ⚠️ Forzamos USD porque CLP no es soportado
        totalForPay = (totalCLP / exchangeRates.USD).toFixed(2);
        alert(`PayPal no acepta CLP. El total se cobrará en USD: $${totalForPay}`);
    } else if (currentCurrency === 'USD') {
        totalForPay = (totalCLP / exchangeRates.USD).toFixed(2);
    } else if (currentCurrency === 'EUR') {
        totalForPay = (totalCLP / exchangeRates.EUR).toFixed(2);
    }

    alert(`Total a pagar: ${formatPrice(totalCLP)} (${currencyCode}). Selecciona un método de pago abajo.`);

    // Cargar SDK PayPal con la moneda correcta antes de mostrar el botón
    try {
        await loadPaypalSdk(currencyCode);
    } catch (error) {
        alert('No se pudo cargar el SDK de PayPal');
        console.error(error);
        return;
    }

    // Vaciar contenedor y renderizar botón PayPal
    document.getElementById('paypal-button-container').innerHTML = '';

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'blue',
            shape:  'rect',
            label:  'paypal'
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: currencyCode,
                        value: totalForPay
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert(`✅ Pago realizado por ${details.payer.name.given_name}. ¡Gracias por tu compra!`);

                cart = [];
                document.getElementById('cartItems').innerHTML = '<p style="text-align: center; color: #666; padding: 50px;">Tu carrito está vacío</p>';
                document.getElementById('cartTotal').style.display = 'none';
                document.getElementById('btnPay').style.display = 'none';
                document.getElementById('paypal-button-container').innerHTML = '';
            });
        },
        onError: function(err) {
            console.error('Error al procesar el pago:', err);
            alert("❌ Ocurrió un error al procesar el pago con PayPal.");
        }
    }).render('#paypal-button-container');
}


// Logout
function logout() {
    localStorage.removeItem('currentUser');
    location.href = '../Login/';
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

// Mostrar éxito
function showSuccess(message) {
    const alertBox = document.getElementById('customSuccess');
    const messageSpan = document.getElementById('successMessage');
    messageSpan.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000); // 3 segundos
}

// Iniciar la aplicación
window.addEventListener('DOMContentLoaded', () => {
    fetchExchangeRates(); // cargar tipos de cambio antes que nada
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
    loadCategoriasFiltro();
    loadProducts();
    updateCartDisplay();
});