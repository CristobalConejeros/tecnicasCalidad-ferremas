package com.almacen.ferremas.controller;

import com.almacen.ferremas.dto.CrearPedidoDTO;
import com.almacen.ferremas.entity.Pedido;
import com.almacen.ferremas.entity.PedidoProducto;
import com.almacen.ferremas.entity.PedidoProductoId;
import com.almacen.ferremas.entity.Producto;
import com.almacen.ferremas.entity.Usuario;
import com.almacen.ferremas.repository.PedidoRepository;
import com.almacen.ferremas.repository.ProductoRepository;
import com.almacen.ferremas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public Pedido crearPedido(@RequestBody CrearPedidoDTO dto) {
        Usuario cliente = usuarioRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado("pendiente");

        List<PedidoProducto> items = new ArrayList<>();

        for (CrearPedidoDTO.ItemPedidoDTO item : dto.getProductos()) {
            Producto producto = productoRepository.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            PedidoProducto pedidoProducto = new PedidoProducto();
            PedidoProductoId pedidoProductoId = new PedidoProductoId();

            // No seteamos pedidoId aún porque el pedido no está guardado
            pedidoProductoId.setPedidoId(null);
            pedidoProductoId.setProductoId(producto.getId());

            pedidoProducto.setId(pedidoProductoId);
            pedidoProducto.setPedido(pedido);
            pedidoProducto.setProducto(producto);
            pedidoProducto.setCantidad(item.getCantidad());
            pedidoProducto.setPrecioUnitario(producto.getPrecio());

            items.add(pedidoProducto);
        }

        pedido.setProductos(items);

        return pedidoRepository.save(pedido);
    }
}
