package com.almacen.ferremas.controller;
// importaciones
import com.almacen.ferremas.entity.Usuario;
import com.almacen.ferremas.repository.UsuarioRepository;
import com.almacen.ferremas.dto.UsuarioDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios/")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @GetMapping//obtener todos los usuarios
    public List<Usuario> obtenerUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/dto")
    public List<UsuarioDTO> leerUsuariosDTO(){
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDTO> usuariosDTO = new ArrayList<>();
        for (Usuario user : usuarios) {
            usuariosDTO.add(new UsuarioDTO(user.getId(), user.getImg(), user.getRut(), user.getNombre(), user.getCorreo(), user.getContrasena(),user.getTelefono(), user.getRol()));//user.getSucursal().getNombre() por si hubiera que enlasar con sucursal
        }
        return usuariosDTO;
    }

    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario reemplazarUsuario(@PathVariable int id, @RequestBody Usuario usuarioActualizado){
        return usuarioRepository.findById(id).map(usuario ->{
            usuario.setRut(usuarioActualizado.getRut());
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setCorreo(usuarioActualizado.getCorreo());
            usuario.setContrasena(usuarioActualizado.getContrasena());
            usuario.setTelefono(usuarioActualizado.getTelefono());
            usuario.setRol(usuarioActualizado.getRol());
            //usuario.setSucursal(usuarioActualizado.getSucursal()); para enlazar con sucursal si es necesario
            return usuarioRepository.save(usuario);
        }).orElseGet(() ->{
            usuarioActualizado.setId(id);
            return usuarioRepository.save(usuarioActualizado);
        });
    }

    @PatchMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable int id, @RequestBody Map<String, Object> campos){
        return usuarioRepository.findById(id).map(usuario ->{
            campos.forEach((key, value) -> {
                Field campo;
                try{
                    campo=Usuario.class.getDeclaredField(key);
                    campo.setAccessible(true);
                    campo.set(usuario, value);
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new RuntimeException("Error al actualizar el campo:" + key, e);
                }
            });
            return usuarioRepository.save(usuario);
        }).orElseThrow(()-> new RuntimeException("ID Usuario no encontrada" + id));
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable int id){
        usuarioRepository.deleteById(id);
    }
}
