const multer = require('multer');
const path = require('path');


// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Especifica la carpeta donde se guardarán los archivos
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único para evitar conflictos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// Crea el middleware de multer
const upload = multer({ storage });

module.exports = upload;
