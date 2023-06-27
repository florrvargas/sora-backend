const {Router} = require('express');
const router = Router();
const { Driver} = require('../db');
const {encrypt, compare} = require('../helpers/bcrypt');
const {mailUsuarioCreado} = require('../helpers/mailsService');
const { subirImagen } = require('../helpers/cloudinary');
const upload = require('../helpers/fileUpload');



// router.post('/registro', async (req, res) => {
// 	const {	nombre,
// 		 	contraseña,
// 			correo,
// 			foto,
// 			direccion,
// 			carnetidentidad,
// 			hojaDeVida,
// 			antecedentes,
// 			numeroCuenta,
// 			documentosVehiculo,
// 			licenciaConducir,
// 			imagenSeguro,
// 			tipoDeViaje,
// 			vehiculoAsegurado,
// 		} = req.body;

// 	try {
// 		const contraseñaHash = await encrypt(contraseña);

// 		const perfil = await subirImagen (req.files.foto.tempFilePath);
// 		const carnetidentidad = await subirImagen (req.files.carnetidentidad.tempFilePath);
// 		const hojaDeVida = await subirImagen (req.files.hojaDeVida.tempFilePath);
// 		const antecedentes = await subirImagen (req.files.antecedentes.tempFilePath);
// 		const documentosVehiculo = await subirImagen (req.files.documentosVehiculo.tempFilePath);
// 		const licenciaConducir = await subirImagen (req.files.licenciaConducir.tempFilePath);
// 		const imagenSeguro = await subirImagen (req.files.imagenSeguro.tempFilePath);
  		
  
//   		await fs.unlink(req.files.foto.tempFilePath);
//   		await fs.unlink(req.files.carnetidentidad.tempFilePath);
//   		await fs.unlink(req.files.hojaDeVida.tempFilePath);
//   		await fs.unlink(req.files.antecedentes.tempFilePath);
//   		await fs.unlink(req.files.documentosVehiculo.tempFilePath);
//   		await fs.unlink(req.files.licenciaConducir.tempFilePath);
//   		await fs.unlink(req.files.imagenSeguro.tempFilePath);

// 		const createDriver = await Driver.create({
// 			nombre,
// 			contraseña: contraseñaHash,
// 			correo,
// 			foto : perfil.secure_url,
// 			direccion,
// 			carnetidentidad,
// 			hojaDeVida : hojaDeVida.secure_url,
// 			antecedentes : antecedentes.secure_url,
// 			numeroCuenta,
// 			documentosVehiculo : documentosVehiculo.secure_url,
// 			licenciaConducir : licenciaConducir.secure_url,
// 			imagenSeguro: imagenSeguro.secure_url,
// 			tipoDeViaje,
// 			vehiculoAsegurado,
// 		});

// 		///// notificación por mail - usuario registrado

// 		// const asunto = 'Bienvenida a Sora';

// 		// const texto = `<p>Hola ${nombre}!<br><br>Estamos muy felices de recibirte en Sora!<br><br>A partir de ahora vas a poder usar nuestro servicio y viajar feliz y segura!<br><br>
// 		// 				<br><br>Nos vemos!</p>`;

// 		// mailUsuarioCreado(correo, asunto, texto);

// 		/////////

// 		res.status(200).send(createDriver);
// 	} catch (error) {
// 		res.status(400).send({error: error.message});
// 	}
// });

// router.post('/registro',  upload.fields([
// 	{ name: 'foto', maxCount: 1 },
// 	{ name: 'carnetidentidad', maxCount: 1 },
// 	{ name: 'hojaDeVida', maxCount: 1 },
// 	{ name: 'antecedentes', maxCount: 1 },
// 	{ name: 'documentosVehiculo', maxCount: 1 },
// 	{ name: 'licenciaConducir', maxCount: 1 },
// 	{ name: 'imagenSeguro', maxCount: 1 },
//   ]), async (req, res) => {

// 	const { nombre, correo, contrasena, edad, direccion, numeroCuenta, tipoDeViaje, vehiculoAsegurado } = req.body;

//   const foto = req.files['foto'][0].filename;
//   const carnetidentidad = req.files['carnetidentidad'][0].filename;
//   const hojaDeVida = req.files['hojaDeVida'][0].filename;
//   const antecedentes = req.files['antecedentes'][0].filename;
//   const documentosVehiculo = req.files['documentosVehiculo'][0].filename;
//   const licenciaConducir = req.files['licenciaConducir'][0].filename;
//   const imagenSeguro = req.files['imagenSeguro'][0].filename;


// 	try {
// 		// Verifica si la conductora ya existe
// 		const conductoraExistente = await Driver.findOne({ where: { correo } });
// 		if (conductoraExistente) {
// 		  return res.status(400).send({ error: 'El correo ya está registrado' });
// 		}

// 		const contraseñaHash = await encrypt(contrasena);

// 	  // Crear el registro del conductor en la base de datos
// 	// Crear el registro del conductor en la base de datos
//     const createDriver = await Driver.create({
// 		nombre,
// 		foto,
// 		contraseña: contraseñaHash,
// 		correo,
// 		edad,
// 		direccion,
// 		carnetidentidad,
// 		hojaDeVida,
// 		antecedentes,
// 		numeroCuenta,
// 		documentosVehiculo,
// 		licenciaConducir,
// 		imagenSeguro,
// 		tipoDeViaje,
// 		vehiculoAsegurado,
// 	  });
  
// 	  res.status(200).send({createDriver, tipo: "conductora"});
// 	} catch (error) {
// 		console.log(error)
// 	  res.status(400).send({ error: error.message });
// 	}
//   });

router.post('/login', async (req, res) => {
	const {correo, contraseña} = req.body;
	try {
		const driver = await Driver.findOne({
			where: {
				correo: correo,
			},
		});

		if (!driver) {
			res.status(404).send({error: 'Conductora no encontrada'});
		}
		const checkContraseña = await compare(contraseña, driver.contraseña);
		if (checkContraseña) {
			res.status(200).send({driver, res:"login exitoso"});
		}
		if (!checkContraseña) {
			res.status(400).send({error: 'contraseña incorrecta'});
		}
	} catch (error) {
		res.status(400).send({error: 'contraseña incorrecta'});
	}
});

router.get("/", async (req, res) => {
		try {
			const drivers = await Driver.findAll();
			if (!drivers.length) {
			res.status(400).send({ error: "No se encontraron conductoras" });
			} else {
			res.status(200).send(drivers);
			}
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
		});

router.get("/:correo", async (req, res) => {
	try {
		const { correo } = req.params;
		const conductora = await Driver.findOne({
		  where: {
			correo: correo,
		  },
		});
		if (conductora) {
		  res.status(200).send(conductora);
		} else {
		  res.status(400).send("No hay ninguna conductora con el correo ingresado");
		}
	  } catch (error) {
		console.log(error);
	  }
	});

router.delete("/:correo", async (req, res) => {

		const { correo } = req.params;
			try {
				const conductora = await Driver.findOne({
					where: {
					  correo: correo,
					},
				  });

				if(conductora){
					await Driver.destroy({
						where: {
						  correo: correo,
						},
					  });
				}

				
			  }catch (error) {
		  res.status(400).json({ error: error.message });
		}
	  });


	  router.put('/:id', async (req, res) => {
		const { nombre, contraseña, foto} = req.body;
		const { id } = req.params;
		try {
		// Verificar si el usuario existe
		const usuarioExistente = await Driver.findOne({
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
		usuarioExistente.contraseña = contraseña;
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
	  

module.exports = router;
