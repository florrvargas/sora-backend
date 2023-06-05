const {Router} = require('express');
const router = Router();
const {User, Driver} = require('../db');
const {encrypt, compare} = require('../helpers/bcrypt');
const {tokenSign} = require('../helpers/generarToken');
const {mailUsuarioCreado} = require('../helpers/mailsService');

router.post('/registro', async (req, res) => {
		const {nombre, correo, contraseña, foto} = req.body;

		try {
			const contraseñaHash = await encrypt(contraseña);
			const createUser = await User.findOrCreate({
				where: { correo },
				defaults: { 
				nombre,
				correo,
				contraseña: contraseñaHash,
				foto,
				}
			});

			///// notificación por mail - usuario registrado

			// const asunto = 'Bienvenid@ a Sora';

			// const texto = `<p>Hola ${nombre}!<br><br>Estamos muy felices de recibirte en Sora!<br><br>A partir de ahora vas a poder usar nuestro servicio y viajar feliz y segura!<br><br>
			// 				<br><br>Nos vemos!</p>`;

			// mailUsuarioCreado(correo, asunto, texto);

			const user = {
				contraseña:contraseñaHash,
				correo:correo
			}
			
			res.status(200).send({user, res:"Usuario creado"});

		} catch (error) {

			res.status(400).send({error: error.message});

		}
});

router.post('/login', async (req, res) => {
		const {correo, contraseña} = req.body;

		try {
			const usuario = await User.findOne({
				where: {
					correo: correo,
				},
			});

			if (!usuario) {
				res.status(404).send({error: 'Usuario no encontrado'});
			}
			const checkContraseña = await compare(contraseña, usuario.contraseña);
			console.log(checkContraseña)
			if (checkContraseña) {
				res.status(200).send({usuario, res:"login exitoso"});
			}
			if (!checkContraseña) {
				res.status(400).send({error: 'contraseña incorrecta'});
			}
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

router.put("/", async (req, res) => {
  
	const { nombre, correo, edad, direccion  } = req.body;
  
	const usuarioActualizado = {
		nombre,
		correo,
		edad,
		direccion,
	};
	
	const usuarioEncontrado = await User.findOne({
	  where: {
		correo: correo,
	  },
	});
	
	await usuarioEncontrado.update(nuevaConductora, { where: { correo: correo } });
	await usuarioEncontrado.save();
  
	res.status(200).send(viajeEcontrado);
	});
  

	router.get("/test", async (req, res)=> {

		res.status(200).send("Back funcionando");

	  });



module.exports = router;
