package com.almacen.ferremas.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductoDTO {
    private String nombre;
    private String descripcion;
    private  String imagen;
    private String marca;
    private int stock;
    private double precio;
    private String estado;
    @JsonProperty("id_categoria")
    private Integer id_categoria;

    public ProductoDTO() {
    }

    public ProductoDTO(String nombre, String descripcion, String imagen, String marca, int stock, double precio, String estado, Integer id_categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.marca = marca;
        this.stock = stock;
        this.precio = precio;
        this.estado = estado;
        this.id_categoria = id_categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(Integer id_categoria) {
        this.id_categoria = id_categoria;
    }
}
