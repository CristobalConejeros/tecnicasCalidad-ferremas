        // Variables globales
        let currentUser = null;
        let products = [];
        let cart = [];
        console.log("hola mundo");
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

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="Archivos/${product.imagen}">
                    <h3>${product.nombre}</h3>
                    <p><strong>Marca:</strong> ${product.marca}</p>
                    <p>${product.descripcion}</p>
                    <div class="price">$${product.precio.toLocaleString('es-CL')}</div>
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
                        <p>Cantidad: ${item.quantity} | Precio unitario: $${item.precio.toLocaleString('es-CL')}</p>
                        <p><strong>Subtotal: $${itemTotal.toLocaleString('es-CL')}</strong></p>
                    </div>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Eliminar</button>
                `;
                cartItems.appendChild(cartItem);
            });

            cartTotal.textContent = `Total: $${total.toLocaleString('es-CL')}`;
            cartTotal.style.display = 'block';
            btnPay.style.display = 'block';
        }

        // Borrar del carrito
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
        }

        // Metodos de pago
        function processPayment() {
            if (cart.length === 0) {
                showSuccess('El carrito está vacío, agrega productos antes de pagar.');
                return;
            }

            const totalAmount = cart.reduce((total, item) => total + item.precio * item.quantity, 0); // modificar para obtener precio real
            alert(`Total a pagar: $${totalAmount.toLocaleString('es-CL')}. Selecciona un método de pago abajo.`);

            // Vaciar el contenedor antes de volver a renderizar el botón (evita múltiples botones)
            document.getElementById('paypal-button-container').innerHTML = '';

            // Mostrar el botón de PayPal
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: totalAmount.toFixed(0)
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert(`✅ Pago realizado por ${details.payer.name.given_name}. ¡Gracias por tu compra!`);

                        // Limpiar carrito
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


        // Login
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
                    window.location.href = 'Home/index.html';
                    // showSuccess('¡Inicio de sesión exitoso!');
                } else {
                    showError('loginError', 'Correo o contraseña incorrectos');
                }
            } catch (error) {
                console.error('Error en login:', error);
                showError('loginError', 'Error de conexión. Inténtalo de nuevo.');
            }
        }

        // Registro
        async function register(event) {
            event.preventDefault();

            const userData = {
                rut: document.getElementById('registerRut').value,
                nombre: document.getElementById('registerName').value,
                telefono: document.getElementById('registerPhone').value,
                correo: document.getElementById('registerEmail').value,
                contrasena: document.getElementById('registerPassword').value,
                rol: 'Cliente'
            };

            // Validar email
            if (!userData.correo.includes('@')) {
                showError('registerError', 'El correo debe contener @');
                return;
            }

            try {
                const response = await fetch('http://localhost:8091/api/usuarios/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    showSuccess('registerSuccess', '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                    setTimeout(() => {
                        showView('login');
                    }, 2000);
                } else {
                    showError('registerError', 'Error al crear la cuenta. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error en registro:', error);
                showError('registerError', 'Error de conexión. Inténtalo de nuevo.');
            }
        }

        // Logout
        function logout() {
            currentUser = null;
            cart = [];
            document.getElementById('userWelcome').style.display = 'none';
            document.getElementById('loginBtn').style.display = 'inline';
            document.getElementById('logoutBtn').style.display = 'none';
            updateCartDisplay();
            showView('home');
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
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            updateCartDisplay();
        });