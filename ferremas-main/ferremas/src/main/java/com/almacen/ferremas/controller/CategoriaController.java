package com.almacen.ferremas.controller;

import com.almacen.ferremas.dto.CategoriaDTO;
import com.almacen.ferremas.entity.Categoria;
import com.almacen.ferremas.repository.CategoriaRepository;

import com.almacen.ferremas.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias/")
public class CategoriaController {
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Categoria> obtenerCategorias() {return categoriaRepository.findAll();}

    @GetMapping("/dto")
    public List<CategoriaDTO> obtenerCategoriasDTO() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<CategoriaDTO> categoriasDTO = new ArrayList<>();
        for (Categoria categoria : categorias) {
            categoriasDTO.add(new CategoriaDTO(categoria.getId(), categoria.getNombre()
            ));
        }
        return categoriasDTO;
    }

    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) { return categoriaRepository.save(categoria); }

    @PutMapping
    public Categoria reemplazarCategoria(@PathVariable int id, @RequestBody Categoria categoriaActualizado){
        return categoriaRepository.findById(id).map(categoria -> {
            categoria.setNombre(categoriaActualizado.getNombre());
            return categoriaRepository.save(categoria);
        }).orElseGet(() -> {
            categoriaActualizado.setId(id);
            return categoriaRepository.save(categoriaActualizado);
        });
    }

    @PatchMapping("/{id}")
    public Categoria actualizarCategoria(@PathVariable int id, @RequestBody Map<String, Object> campos) {
        return categoriaRepository.findById(id).map(categoria -> {
            campos.forEach((key, value) -> {
                try {
                    Field campo = Categoria.class.getDeclaredField(key);
                    campo.setAccessible(true);
                    campo.set(categoria, value);
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new RuntimeException("Error al actualizar el campo: " + key, e);
                }
            });
            return categoriaRepository.save(categoria);
        }).orElseThrow(() -> new RuntimeException("ID Categoria no encontrado: " + id));
    }

    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable int id){
        categoriaRepository.deleteById(id);
    }
}
