// Mostrar pedidos
async function loadPedidos() {
    try {
        const res = await fetch('http://localhost:8091/api/pedidos/');
        const pedidos = await res.json();
        const container = document.getElementById('pedidoListContainer');

        if (!pedidos.length) {
            container.innerHTML = '<p style="text-align:center;">No hay pedidos registrados.</p>';
            return;
        }

        let html = '';
        pedidos.forEach(pedido => {
            let productosHtml = '';
            pedido.productos.forEach(prod => {
                productosHtml += `<li>${prod.nombre} - Cantidad: ${prod.cantidad}</li>`;
            });

            html += `
                <div class="pedido-card">
                    <h3>Pedido #${pedido.id}</h3>
                    <p><strong>Cliente:</strong> ${pedido.usuario?.nombre || 'N/A'}</p>
                    <p><strong>Total:</strong> $${pedido.total?.toLocaleString('es-CL')}</p>
                    <ul>${productosHtml}</ul>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-success" onclick="aprobarPedido(${pedido.id})">Aprobar</button>
                        <button class="btn btn-danger" onclick="rechazarPedido(${pedido.id})">Rechazar</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('pedidoListContainer').innerHTML = '<p>Error al cargar pedidos.</p>';
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

function aprobarPedido(id) {
    // Aquí puedes hacer un fetch PUT o PATCH para cambiar el estado a "aprobado"
    alert(`Pedido ${id} aprobado`);
}

function rechazarPedido(id) {
    // Aquí puedes hacer un fetch PUT o PATCH para cambiar el estado a "rechazado"
    alert(`Pedido ${id} rechazado`);
}

window.addEventListener('DOMContentLoaded', () => {
    showView('home'); // Muestra la vista de inicio al cargar
});