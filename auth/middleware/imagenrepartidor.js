const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let subFolder;
        switch (file.fieldname) {
            case 'fotoPerfilIzquierda':
                subFolder = 'FotoPerfilIzquierda';
                break;
            case 'fotoPerfilDerecha':
                subFolder = 'FotoPerfilDerecha';
                break;
            case 'fotoPerfilFrontal':
                subFolder = 'FotoPerfilFrontal';
                break;
            case 'identificacionOficial':
                subFolder = 'IdentificacionOficial';
                break;
            case 'licencia':
                subFolder = 'Licencia';
                break;
            default:
                subFolder = '';
        }
        cb(null, `uploads/repartidor/${subFolder}/`);
    },
    filename: function(req, file, cb) {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    }
});

// Configuración de límites de Multer
const archivosRepartidor = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 100MB
    }
}).fields([
    { name: 'fotoPerfilIzquierda', maxCount: 1 },
    { name: 'fotoPerfilDerecha', maxCount: 1 },
    { name: 'fotoPerfilFrontal', maxCount: 1 },
    { name: 'identificacionOficial', maxCount: 1 },
    { name: 'licencia', maxCount: 1 }
]);

module.exports = archivosRepartidor;