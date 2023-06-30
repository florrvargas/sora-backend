const {Router} = require('express');
const { Driver, User } = require('../db'); // Importa los modelos de conductoras y pasajeras
const {tokenSign} = require('../helpers/generarToken');
const router = Router();
const user= require("./users");
const driver = require("./drivers");
const travel = require("./travels")
const pago = require("./pagos")
// Configurar los routers
 
router.use('/usuarios', user);
router.use('/conductoras/', driver);
router.use('/viajes', travel);
router.use('/pago', pago);


// router.post('/login', async (req, res) => {
//   const { correo, contraseña } = req.body;

//   try {
//     // Busca en el modelo de conductoras
//     const driver = await Driver.findOne({ where: { correo: correo } });

//     if (driver) {
//       if (driver.contraseña === contraseña) {
//         // Autenticación exitosa
//         // Genera un token de autenticación y envíalo al frontend
//         const token = tokenSign(driver.id);
//         return res.status(200).json({ token, usuario: 'conductora' });
//       }
//     }

//     // Si no se encuentra en el modelo de conductoras, busca en el modelo de pasajeras
//     const user = await User.findOne({ where: { correo: correo } });

//     if (user) {
//       if (user.contraseña === contraseña) {
//         // Autenticación exitosa
//         // Genera un token de autenticación y envíalo al frontend
//         const token = tokenSign(user.id);
//         return res.status(200).json({ token, usuario: 'pasajera' });
//       }
//     }

//     // Credenciales inválidas
//     return res.status(400).json({ error: 'Credenciales inválidas' });
//   } catch (error) {
//     // Error en el servidor
//     return res.status(500).json({ error: 'Error en el servidor' });
//   }
// });

router.get("/test", async (req, res)=> {
    res.status(200).send("Back funcionando");
  });

module.exports = router;