package com.almacen.ferremas.repository;

import com.almacen.ferremas.entity.PedidoProducto;
import com.almacen.ferremas.entity.PedidoProductoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, PedidoProductoId> {}
