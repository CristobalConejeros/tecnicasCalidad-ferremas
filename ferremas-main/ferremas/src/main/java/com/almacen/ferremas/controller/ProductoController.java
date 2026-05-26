package com.almacen.ferremas.controller;

import com.almacen.ferremas.dto.ProductoDTO;
import com.almacen.ferremas.entity.Categoria;
import com.almacen.ferremas.entity.Producto;
import com.almacen.ferremas.repository.CategoriaRepository;
import com.almacen.ferremas.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos/")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoRepository.findAll();
    }

    // Obtener productos con DTO (idCategoria)
    @GetMapping("/dto")
    public List<ProductoDTO> obtenerProductosDTO() {
        List<Producto> productos = productoRepository.findAll();
        List<ProductoDTO> productosDTO = new ArrayList<>();
        for (Producto producto : productos) {
            productosDTO.add(new ProductoDTO(
                    producto.getNombre(),
                    producto.getDescripcion(),
                    producto.getImagen(),
                    producto.getMarca(),
                    producto.getStock(),
                    producto.getPrecio(),
                    producto.getEstado(),
                    producto.getCategoria() != null ? producto.getCategoria().getId() : null
            ));
        }
        return productosDTO;
    }

    // Crear producto con DTO
    @PostMapping
    public Producto crearProducto(@RequestBody ProductoDTO productoDTO) {
        try {
            Categoria categoria = categoriaRepository.findById(productoDTO.getId_categoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

            Producto producto = new Producto();
            producto.setNombre(productoDTO.getNombre());
            producto.setDescripcion(productoDTO.getDescripcion());
            producto.setImagen(productoDTO.getImagen());
            producto.setMarca(productoDTO.getMarca());
            producto.setStock(productoDTO.getStock());
            producto.setPrecio(productoDTO.getPrecio());
            producto.setEstado(productoDTO.getEstado());
            producto.setCategoria(categoria);

            return productoRepository.save(producto);
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el error en consola
            throw new RuntimeException("Error al crear producto: " + e.getMessage(), e);
        }
    }



    // Actualizar producto con PUT usando DTO
    @PutMapping("/{id}")
    public Producto reemplazarProducto(@PathVariable int id, @RequestBody ProductoDTO productoDTO){
        Categoria categoria = categoriaRepository.findById(productoDTO.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        return productoRepository.findById(id).map(producto -> {
            producto.setNombre(productoDTO.getNombre());
            producto.setDescripcion(productoDTO.getDescripcion());
            producto.setMarca(productoDTO.getMarca());
            producto.setStock(productoDTO.getStock());
            producto.setPrecio(productoDTO.getPrecio());
            producto.setEstado(productoDTO.getEstado());
            producto.setImagen(productoDTO.getImagen());
            producto.setCategoria(categoria);
            return productoRepository.save(producto);
        }).orElseGet(() -> {
            Producto producto = new Producto();
            producto.setId(id);
            producto.setNombre(productoDTO.getNombre());
            producto.setDescripcion(productoDTO.getDescripcion());
            producto.setMarca(productoDTO.getMarca());
            producto.setStock(productoDTO.getStock());
            producto.setPrecio(productoDTO.getPrecio());
            producto.setEstado(productoDTO.getEstado());
            producto.setImagen(productoDTO.getImagen());
            producto.setCategoria(categoria);
            return productoRepository.save(producto);
        });
    }

    // Para PATCH, cuidado: si actualizas categoria debe buscarse y asignarse el objeto Categoria
    @PatchMapping("/{id}")
    public Producto actualizarProducto(@PathVariable int id, @RequestBody Map<String, Object> campos){
        return productoRepository.findById(id).map(producto -> {
            campos.forEach((key, value) -> {
                try {
                    if ("categoria".equals(key) || "idCategoria".equals(key)) {
                        // Asumir que llega idCategoria en el patch
                        Integer idCat = (Integer) value;
                        Categoria categoria = categoriaRepository.findById(idCat)
                                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                        producto.setCategoria(categoria);
                    } else {
                        Field campo = Producto.class.getDeclaredField(key);
                        campo.setAccessible(true);
                        campo.set(producto, value);
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new RuntimeException("Error al actualizar el campo: " + key, e);
                }
            });
            return productoRepository.save(producto);
        }).orElseThrow(() -> new RuntimeException("ID Producto no encontrado: " + id));
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable int id){
        productoRepository.deleteById(id);
    }
}
