const {Router} = require('express');
const router = Router();
const {User, Driver} = require('../db');
const {encrypt, compare} = require('../helpers/bcrypt');
const {tokenSign} = require('../helpers/generarToken');
const {mailUsuarioCreado} = require('../helpers/mailsService');
const fs = require('fs');
const path = require('path');
const upload = require('../helpers/fileUpload');

// router.post('/registro', async (req, res) => {
// 		const {nombre, correo, contraseña, foto} = req.body;

// 		try {
// 			const contraseñaHash = await encrypt(contraseña);
// 			const createUser = await User.findOrCreate({
// 				where: { correo },
// 				defaults: { 
// 				nombre,
// 				correo,
// 				contraseña: contraseñaHash,
// 				foto,
// 				}
// 			});

// 			///// notificación por mail - usuario registrado

// 			// const asunto = 'Bienvenid@ a Sora';

// 			// const texto = `<p>Hola ${nombre}!<br><br>Estamos muy felices de recibirte en Sora!<br><br>A partir de ahora vas a poder usar nuestro servicio y viajar feliz y segura!<br><br>
// 			// 				<br><br>Nos vemos!</p>`;

// 			// mailUsuarioCreado(correo, asunto, texto);

// 			const user = {
// 				contraseña:contraseñaHash,
// 				correo:correo
// 			}
			
// 			res.status(200).send({user, res:"Usuario creado"});

// 		} catch (error) {

// 			res.status(400).send({error: error.message});

// 		}
// });

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// mobile ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

router.post('/registro',upload.single('fotoDni'),  async (req, res) => {
	console.log('EL BODYYYYYYYYYYY', req.body);
	console.log('EL FILEYYYYYYYYYYY', req.file);

	const { nombre, correo, contrasena, foto, googleId, dni, genero } = req.body;
	
	const fotoDni = req.file.filename;

	try {
	  // Check if the user already exists
	  const usuarioExistente = await User.findOne({ where: { correo: correo } });
	  if (usuarioExistente) {
		return res.status(400).send({ error: 'El correo ya está registrado. Inicie sesión.' });
	  }
	  const conductoraExistente = await Driver.findOne({ where: { correo: correo } });
	  if (conductoraExistente) {
		return res.status(400).send({ error: 'El correo ya está registrado. Inicie sesión.' });
	  }

	  const contraseñaHash = await encrypt(contrasena);
	  const createUser = await User.create({
		nombre,
		correo,
		contraseña: contraseñaHash,
		foto,
		fotoDni,
        dni,
        genero,
		googleId,
	  });
	  res.status(200).send({ createUser, tipo: 'pasajera', message: 'Usuario creado' });
	} catch (error) {
	  console.log(error);
	  res.status(400).send({ error: error.message });
	}
  });

  

	router.put('/editarUser/:id', async (req, res) => {
		const { nombre, contraseña, foto } = req.body;
		const { id } = req.params;
		try {
		const usuarioExistente = await User.findOne({
		where: { id },
		});
		if (!usuarioExistente) {
		return res.status(404).send('Usuario no encontrado');
		}
		// Actualizar los campos del usuario si se proporcionan
		if (nombre) {
		usuarioExistente.nombre = nombre;
		}
		if (foto) {
		usuarioExistente.foto = foto;
		}
		if (contraseña) {
		const contraseñaHash = await encrypt(contraseña);
		usuarioExistente.contraseña = contraseñaHash;
		}
		// Guardar los cambios en la base de datos
		await usuarioExistente.save();
		res
		.status(200)
		.send({ usuario: usuarioExistente, mensaje: 'Usuario actualizado' });
		} catch (error) {
		res.status(400).send({ error: error.message });
		}
		});


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// mobile ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

async function verifyPassword(enteredPassword, savedPassword) {
	const checkContraseña = await compare(enteredPassword, savedPassword);
	return checkContraseña;
  }

router.post('/login', async (req, res) => {
		const {correo, contraseña} = req.body;


		try {
			const usuario = await User.findOne({
				where: {
					correo: correo,
				},
			});

			if (usuario) {
      if (await verifyPassword(contraseña, usuario.contraseña)) {
        const token = tokenSign(usuario);
        return res.status(200).json({ token, usuario, tipo: 'pasajera' });
      } else {
        return res.status(400).send({ error: 'Contraseña incorrecta.' });
      }
    }

    const conductora = await Driver.findOne({
      where: {
        correo: correo,
      },
    });

    if (conductora) {
      if (await verifyPassword(contraseña, conductora.contraseña)) {
        const token = tokenSign(conductora);
        return res.status(200).json({ token, conductora, tipo: 'conductora' });
      } else {
        return res.status(400).send({ error: 'Contraseña incorrecta.' });
      }
    }

			// Credenciales inválidas
			return res.status(400).send({error: 'El correo no se encuentra registrado. Por favor, regístrate.'});
			
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
});

router.get("/", async (req, res) => {
	try {
		const users = await User.findAll();
		if (!users.length) {
		res.status(400).send({ error: "No se encontraron usuarios" });
		} else {
		res.status(200).send(users);
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.get("/:correo", async (req, res) => {
		try {
		  const { correo } = req.params;
		  const userId = await User.findOne({
			where: {
			  correo: correo,
			  
			},
		  });
		  if (userId) {
			res.status(200).send(userId);
		  } else {
			res.status(400).send("No hay ningun usuario con el correo ingresado");
		  }
		} catch (error) {
		  console.log(error);
		}
});

router.delete("/:correo", async (req, res) => {

		const { correo } = req.params;
		  try {
			const user = await User.findOne({
			  where: {
				correo: correo,
			  },
			  });
	  
			if(user){
			  await User.destroy({
				where: {
					correo: correo,
				},
				});
			}
	  
			
			}catch (error) {
		  res.status(400).json({ error: error.message });
		}
});

module.exports = router;
