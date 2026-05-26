package com.almacen.ferremas.dto;

import java.util.Date;
import java.util.List;

public class PedidoDTO {

    private Integer id;
    private Date fecha;
    private String estado;
    private ClienteDTO cliente;
    private List<ItemPedidoDTO> productos;

    public PedidoDTO() {
    }

    public PedidoDTO(Integer id, Date fecha, String estado, ClienteDTO cliente, List<ItemPedidoDTO> productos) {
        this.id = id;
        this.fecha = fecha;
        this.estado = estado;
        this.cliente = cliente;
        this.productos = productos;
    }

    public static class ClienteDTO {
        private Integer id;
        private String nombre;
        private String correo;

        // Getters y setters
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }

        public String getCorreo() { return correo; }
        public void setCorreo(String correo) { this.correo = correo; }
    }

    public static class ItemPedidoDTO {
        private Integer idProducto;
        private String nombreProducto;
        private Integer cantidad;
        private Double precioUnitario;

        // Getters y setters
        public Integer getIdProducto() { return idProducto; }
        public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

        public String getNombreProducto() { return nombreProducto; }
        public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    }

    // Getters y setters principales
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public ClienteDTO getCliente() { return cliente; }
    public void setCliente(ClienteDTO cliente) { this.cliente = cliente; }

    public List<ItemPedidoDTO> getProductos() { return productos; }
    public void setProductos(List<ItemPedidoDTO> productos) { this.productos = productos; }
}
