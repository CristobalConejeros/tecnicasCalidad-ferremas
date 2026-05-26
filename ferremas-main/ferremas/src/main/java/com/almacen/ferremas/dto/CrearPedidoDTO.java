package com.almacen.ferremas.dto;

import java.util.List;

// Dentro de CrearPedidoDTO.java
public class CrearPedidoDTO {
    private Integer idCliente;
    private List<ItemPedidoDTO> productos;

    // getters y setters

    public Integer getIdCliente() {
        return idCliente;
    }
    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public List<ItemPedidoDTO> getProductos() {
        return productos;
    }
    public void setProductos(List<ItemPedidoDTO> productos) {
        this.productos = productos;
    }

    public static class ItemPedidoDTO {
        private Integer idProducto;
        private Integer cantidad;

        // getters y setters
        public Integer getIdProducto() {
            return idProducto;
        }
        public void setIdProducto(Integer idProducto) {
            this.idProducto = idProducto;
        }
        public Integer getCantidad() {
            return cantidad;
        }
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
