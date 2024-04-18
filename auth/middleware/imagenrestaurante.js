const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let subFolder;
        switch (file.fieldname) {
            case 'menuImagen':
                subFolder = 'Menu';
                break;
            case 'identificacionOficial':
                subFolder = 'IdentificacionOficial';
                break;
            case 'constanciaFiscal':
                subFolder = 'ConstanciaFiscal';
                break;
            case 'estadoCuentaBancaria':
                subFolder = 'CuentaBancaria';
                break;
            case 'licenciaFuncionamiento':
                subFolder = 'Licencia';
                break;
            default:
                subFolder = '';
        }
        cb(null, `uploads/restaurante/${subFolder}/`);
    },
    filename: function(req, file, cb) {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    }
});

// Configuración de límites de Multer
const archivosRestaurante = multer({
    storage: storage,
    limits: {

        fileSize: 10 * 1024 * 1024 // 100MB
    }
}).fields([
    { name: 'menuImagen', maxCount: 1 },
    { name: 'identificacionOficial', maxCount: 1 },
    { name: 'constanciaFiscal', maxCount: 1 },
    { name: 'estadoCuentaBancaria', maxCount: 1 },
    { name: 'licenciaFuncionamiento', maxCount: 1 }
]);

module.exports = archivosRestaurante;