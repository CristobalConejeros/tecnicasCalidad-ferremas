CREATE database almacen;

USE almacen;




CREATE TABLE usuario (
  id int(11) NOT NULL AUTO_INCREMENT,
  rut varchar(255) DEFAULT NULL,
  nombre varchar(255) DEFAULT NULL,
  telefono varchar(255) DEFAULT NULL,
  correo varchar(255) DEFAULT NULL,
  rol varchar(255) DEFAULT NULL,
  contrasena varchar(255) DEFAULT NULL,
  img varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE producto (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(255) DEFAULT NULL,
  descripcion varchar(255) DEFAULT NULL,
  marca varchar(255) DEFAULT NULL,
  stock int(11) NOT NULL,
  precio double NOT NULL,
  estado varchar(255) DEFAULT NULL,
  imagen varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

-- Insertar usuarios de ferretería en la tabla usuario
INSERT INTO usuario (rut, nombre, telefono, correo, contrasena, rol) VALUES
('20668745-2', 'Benjamín Gonzalez', '56912345678', 'benja.gonza@ferremas.cl', '123456', 'Administrador'),
('18840502-9', 'Cristobal Conejeros', '56987654321', 'cristo.cone@ferremas.cl', '123456', 'Vendedor'),
('10691901-1', 'Verónica Mariángel', '56987654321', 'vero.mari@ferremas.cl', '123456', 'Contador'),
('20421318-6', 'Casandra Soto', '56912345678', 'casa.soto@ferremas.cl', '123456', 'Bodeguero');

-- Insertar productos de ferretería en la tabla producto
INSERT INTO producto (nombre, descripcion, marca, stock, precio, estado) VALUES
('Taladro Percutor 18V', 'Taladro inalámbrico con percutor, incluye batería y cargador. Ideal para perforar concreto, metal y madera', 'DeWalt', 15, 89990.00, 'Disponible'),
('Martillo Carpintero 16oz', 'Martillo de carpintero con mango de fibra de vidrio, cabeza forjada en acero al carbono. Peso 16 onzas', 'Stanley', 45, 12490.00, 'Disponible'),
('Tornillos Autorroscantes 6x40mm', 'Caja de 100 unidades de tornillos autorroscantes galvanizados para madera y metal. Cabeza phillips', 'Hilti', 120, 3850.00, 'Disponible'),
('Casco de Seguridad', 'Estilo de gorra de casco con suspensión de trinquete de 4 puntos, casco de seguridad para construcción, resistencia a impactos, casco duro de alta resistencia', 'MSA', 50, 15000.00, 'Disponible');


SELECT * FROM usuario;
SELECT * FROM producto;


