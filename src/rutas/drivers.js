const {Router} = require('express');
const router = Router();
const {Driver} = require('../db');
const {encrypt, compare} = require('../helpers/bcrypt');
const {mailUsuarioCreado} = require('../helpers/mailsService');
const { subirImagen } = require('../helpers/cloudinary');


router.post('/registro', async (req, res) => {
	const {	nombre,
		 	contraseña,
			correo,
			foto,
			direccion,
			carnetidentidad,
			hojaDeVida,
			antecedentes,
			numeroCuenta,
			documentosVehiculo,
			licenciaConducir,
			imagenSeguro,
			tipoDeViaje,
			vehiculoAsegurado,
		} = req.body;

	try {
		const contraseñaHash = await encrypt(contraseña);

		const perfil = await subirImagen (req.files.foto.tempFilePath);
		const carnetidentidad = await subirImagen (req.files.carnetidentidad.tempFilePath);
		const hojaDeVida = await subirImagen (req.files.hojaDeVida.tempFilePath);
		const antecedentes = await subirImagen (req.files.antecedentes.tempFilePath);
		const documentosVehiculo = await subirImagen (req.files.documentosVehiculo.tempFilePath);
		const licenciaConducir = await subirImagen (req.files.licenciaConducir.tempFilePath);
		const imagenSeguro = await subirImagen (req.files.imagenSeguro.tempFilePath);
  		
  
  		await fs.unlink(req.files.foto.tempFilePath);
  		await fs.unlink(req.files.carnetidentidad.tempFilePath);
  		await fs.unlink(req.files.hojaDeVida.tempFilePath);
  		await fs.unlink(req.files.antecedentes.tempFilePath);
  		await fs.unlink(req.files.documentosVehiculo.tempFilePath);
  		await fs.unlink(req.files.licenciaConducir.tempFilePath);
  		await fs.unlink(req.files.imagenSeguro.tempFilePath);

		const createDriver = await Driver.create({
			nombre,
			contraseña: contraseñaHash,
			correo,
			foto : perfil.secure_url,
			direccion,
			carnetidentidad,
			hojaDeVida : hojaDeVida.secure_url,
			antecedentes : antecedentes.secure_url,
			numeroCuenta,
			documentosVehiculo : documentosVehiculo.secure_url,
			licenciaConducir : licenciaConducir.secure_url,
			imagenSeguro: imagenSeguro.secure_url,
			tipoDeViaje,
			vehiculoAsegurado,
		});

		///// notificación por mail - usuario registrado

		// const asunto = 'Bienvenida a Sora';

		// const texto = `<p>Hola ${nombre}!<br><br>Estamos muy felices de recibirte en Sora!<br><br>A partir de ahora vas a poder usar nuestro servicio y viajar feliz y segura!<br><br>
		// 				<br><br>Nos vemos!</p>`;

		// mailUsuarioCreado(correo, asunto, texto);

		/////////

		res.status(200).send(createDriver);
	} catch (error) {
		res.status(400).send({error: error.message});
	}
});

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

router.get("/conductoras", async (req, res) => {
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

router.get("/conductoras/:correo", async (req, res) => {
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

router.delete("/conductoras/:correo", async (req, res) => {

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

router.put("/editarConductora", async (req, res) => {

		const { nombre, correo, edad, direccion } = req.body;

		const nuevaConductora = {
		  nombre,
		  correo,
		  edad,
		  direccion,
		};
	  
		const conductoraEncontrada = await Driver.findOne({
		  where: {
			correo: correo,
		  },
		});
	  
		await conductoraEncontrada.update(nuevaConductora, { where: { correo: correo } });
		await conductoraEncontrada.save();
		const conductoraActualizada = {
		  nombre: userEncontrado.nombre,
		  contraseña: userEncontrado.contraseña,
		  correo: userEncontrado.correo,
		  edad: userEncontrado.edad,
		  direccion: userEncontrado.direccion,
		};
		res.status(200).send(conductoraActualizada);
	  });
	  

module.exports = router;
