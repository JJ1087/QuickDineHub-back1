const Producto = require('../models/auth.modelMenu');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
//PRODUCTOS:
//Funcion para registrar a los restaurantes en la BD
exports.Crearproducto = async(req, res, next) => {

    try {
        console.log('Datos recibidos del Front:', req.body);
        // Crear nuevo usuario
        const nuevoProducto = new Producto({
            _id: new mongoose.Types.ObjectId(),
            idRestaurante: req.body.idRestaurante,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            tiempoP: req.body.tiempoP,
            precio: req.body.precio,
            etiquetas: req.body.etiquetas,
            oferta: '00',
            descuento: '00',
            costoEnvio: '20',
            imagen: req.files.map(file => file.path),
        });
        console.log('Lo que llego carnal: ', nuevoProducto);

        // Guardar el usuario en la base de datos
        await nuevoProducto.save();

        // Responder con éxito y el usuario creado
        res.status(201).json({ message: 'PRODUCTO CREADO' });

    } catch (err) {
        // Manejar errores
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }

};

// Función para mostrar todos los productos
exports.mostrarproducto = async(req, res, next) => {
    try {
        // Obtener todos los productos de la base de datos
        const productos = await Producto.find({ idRestaurante: req.params.restauranteId });

        // Convertir el tipo Decimal128 del precio a un tipo de dato más adecuado, como un número de punto flotante
        const productosModificados = productos.map(producto => ({
            ...producto.toObject(),
            precio: parseFloat(producto.precio.toString()), // Convertir Decimal128 a cadena y luego a número de punto flotante
            descuento: parseFloat(producto.descuento.toString())
        }));

        // Responder con los productos encontrados
        res.status(200).json(productosModificados);
    } catch (err) {
        // Manejar errores
        console.error(err);
        res
            .status(500).json({ error: 'ERROR INESPERADO' });
    }
};

exports.eliminarProducto = async(req, res) => {
    try {
        // Obtén el ID del producto de los parámetros de la solicitud
        const { id } = req.params;
        console.log('Datos recibidos del Front:', req.params);

        // Busca el producto por su ID en la base de datos
        const producto = await Producto.findById(id);
        console.log('Datos de la BD', producto);

        // Verifica si el producto existe
        if (!producto) {
            return res.status(404).json({ mensaje: 'El producto no fue encontrado' });
        } else if (producto) {
            // Elimina las imágenes asociadas al producto del sistema de archivos
            producto.imagen.forEach(imagen => {
                const imagePath = path.join(__dirname, '..', '..', imagen.replace(/\\/g, '/'));
                console.log('ruta:  ', imagePath)
                fs.unlinkSync(imagePath);
            });

            // Elimina el producto de la base de datos
            await Producto.findByIdAndDelete(id);
        }
        // Envía una respuesta de éxito
        return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ mensaje: 'Hubo un error al eliminar el producto' });
    }
};