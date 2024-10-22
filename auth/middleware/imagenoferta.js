const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/restaurante/Ofertas/');
    },
    filename: function(req, file, cb) {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    }
});

// Configuración de límites de Multer
const archivosOfertas = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 100MB
    }
}).array('imagen', 4); // Puedes especificar el número máximo de archivos permitidos en el arreglo

module.exports = archivosOfertas;