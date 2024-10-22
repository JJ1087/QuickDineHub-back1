
const Producto = require('../models/auth.modelMenu');
const oferta = require('../models/auth.modelOferta');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
//PRODUCTOS:
//Funcion para registrar a los restaurantes en la BD
exports.Crearproducto = async(req, res, next) => {

    try {
        console.log('Datos recibidos del Front:', req.body);

        // Convertir la cadena de etiquetas en un array
        const etiquetasArray = JSON.parse(req.body.etiquetas);

        // Crear nuevo producto
        const nuevoProducto = new Producto({
            _id: new mongoose.Types.ObjectId(),
            idRestaurante: req.body.idRestaurante,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: 'Comida Regional Mexicana',
            tiempoP: req.body.tiempoP,
            precio: req.body.precio,
            etiquetas: etiquetasArray,
            oferta: 'Null',
            descuento: '00',
            costoEnvio: '10',
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
//OFERTAS
exports.Crearoferta= async(req, res, next) => {

    try {
        console.log('Datos recibidos del Front:', req.body);

        // Crear nuevo producto
        const nuevaOferta = new oferta({
            _id: new mongoose.Types.ObjectId(),
            idRestaurante: req.body.idRestaurante,
            nombrerestaurante: req.body.nombrerestaurante,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            TipoOferta: req.body.TipoOferta,
            precioOriginal: req.body.precioOriginal,
            precioOferta: req.body.precioOferta,
            imagen: req.files.map(file => file.path),
        });
        console.log('Lo que llego carnal: ', nuevaOferta);

        // Guardar el usuario en la base de datos
        await nuevaOferta.save();

        // Responder con éxito y el usuario creado
        res.status(201).json({ message: 'OFERTA CREADO' });

    } catch (err) {
        // Manejar errores
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }

};

// Función para mostrar todos los productos
exports.mostraroferta = async(req, res, next) => {
    try {
        // Obtener todos los productos de la base de datos
        const ofertas = await oferta.find({ idRestaurante: req.params.restauranteId });

        // Convertir el tipo Decimal128 del precio a un tipo de dato más adecuado, como un número de punto flotante
        const ofertasModificados = ofertas.map(oferta => ({
            ...oferta.toObject(),
            precioOriginal: parseFloat(oferta.precioOriginal.toString()), // Convertir Decimal128 a cadena y luego a número de punto flotante
            precioOferta: parseFloat(oferta.precioOferta.toString())
        }));

        // Responder con los productos encontrados
        res.status(200).json(ofertasModificados);
    } catch (err) {
        // Manejar errores
        console.error(err);
        res
            .status(500).json({ error: 'ERROR INESPERADO' });
    }
};

exports.eliminarOferta = async(req, res) => {
    try {
        // Obtén el ID del producto de los parámetros de la solicitud
        const { id } = req.params;
        console.log('Datos recibidos del Front:', req.params);

        // Busca el producto por su ID en la base de datos
        const Oferta = await oferta.findById(id);
        console.log('Datos de la BD', Oferta);

        // Verifica si el producto existe
        if (!Oferta) {
            return res.status(404).json({ mensaje: 'El producto no fue encontrado' });
        } else if (Oferta) {
            // Elimina las imágenes asociadas al producto del sistema de archivos
            Oferta.imagen.forEach(imagen => {
                const imagePath = path.join(__dirname, '..', '..', imagen.replace(/\\/g, '/'));
                console.log('ruta:  ', imagePath)
                fs.unlinkSync(imagePath);
            });

            // Elimina el producto de la base de datos
            await oferta.findByIdAndDelete(id);
        }
        // Envía una respuesta de éxito
        return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return res.status(500).json({ mensaje: 'Hubo un error al eliminar el producto' });
    }
};

//INFO DE OFERTA A CLIENTE:
// Obtener la información de todos los productos
exports.obtenerInfoOferta = async(req, res, next) => {
    try {
        const ofertas = await oferta.find({}, { _id: 1,titulo:1, imagen: 1, nombrerestaurante: 1, descripcion: 1, TipoOferta: 1, precioOriginal: 1, precioOferta: 1 }); // Incluir el _id y los demás campos en la respuesta
        // Asegurémonos de que cada producto tenga el campo 'imagen' como un arreglo incluso si está vacío
        const ofertasModificados = ofertas.map(oferta => ({
            ...oferta.toObject(),
            precioOriginal: parseFloat(oferta.precioOriginal.toString()), // Convertir Decimal128 a cadena y luego a número de punto flotante
            precioOferta: parseFloat(oferta.precioOferta.toString())
        }));
        ofertas.forEach(ofert => {
            if (!Array.isArray(ofert.imagen)) {
                ofert.imagen = [];
            }
        });
        res.status(200).json(ofertasModificados);
    } catch (error) {
        console.error('Error al obtener la información de productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los productos' });
    }
};
