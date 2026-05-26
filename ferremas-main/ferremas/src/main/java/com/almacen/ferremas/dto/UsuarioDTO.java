package com.almacen.ferremas.dto;

public class UsuarioDTO {
    private int id;
    private String rut;
    private String img;
    private String nombre;
    private String correo;
    private String contrasena;
    private String telefono;
    private String rol;

    public UsuarioDTO() {
    }

    public UsuarioDTO(int id, String rol, String telefono, String contrasena, String correo, String nombre, String img, String rut) {
        this.id = id;
        this.rol = rol;
        this.telefono = telefono;
        this.contrasena = contrasena;
        this.correo = correo;
        this.nombre = nombre;
        this.img = img;
        this.rut = rut;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}

