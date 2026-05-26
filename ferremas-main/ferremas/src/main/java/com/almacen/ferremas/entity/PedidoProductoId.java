package com.almacen.ferremas.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PedidoProductoId implements Serializable {
    private Integer pedidoId;
    private Integer productoId;

    public PedidoProductoId() {
    }

    public PedidoProductoId(Integer pedidoId, Integer productoId) {
        this.pedidoId = pedidoId;
        this.productoId = productoId;
    }


    public Integer getPedidoId() { return pedidoId; }
    public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }

    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PedidoProductoId)) return false;
        PedidoProductoId that = (PedidoProductoId) o;
        return Objects.equals(getPedidoId(), that.getPedidoId()) &&
                Objects.equals(getProductoId(), that.getProductoId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPedidoId(), getProductoId());
    }
}