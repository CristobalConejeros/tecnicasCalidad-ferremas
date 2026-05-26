package com.almacen.ferremas.entity;

import jakarta.persistence.*;

@Entity
@Table(name="usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String rut;
    private String img;
    private String nombre;
    private String telefono;
    private String correo;
    private String contrasena;
    private String rol; //Administrador, Vendedor, Bodeguero, Contador, etc.

    public Usuario() {
    }

    public Usuario(String rol, String contrasena, String correo, String telefono, String nombre, String img, String rut, int id) {
        this.rol = rol;
        this.contrasena = contrasena;
        this.correo = correo;
        this.telefono = telefono;
        this.nombre = nombre;
        this.img = img;
        this.rut = rut;
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
