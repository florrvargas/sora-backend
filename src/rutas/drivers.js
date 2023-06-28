const {Router} = require('express');
const router = Router();
const { Driver} = require('../db');
const {encrypt, compare} = require('../helpers/bcrypt');
const {mailUsuarioCreado} = require('../helpers/mailsService');
const { subirImagen } = require('../helpers/cloudinary');
const upload = require('../helpers/fileUpload');
const fs = require('fs');




// const cloudinary = require('cloudinary').v2;

// router.post('/registro', upload.any(), async (req, res) => {
//   try {
// 	console.log(req.body)
// 	console.log(req.files)
//     const {
//       nombre,
//       correo,
//       contrasena,
//       edad,
//       direccion,
//       numeroCuenta,
//       tipoDeViaje,
//       vehiculoAsegurado,
//     } = req.body;

//     const foto = req.files.find(file => file.fieldname === 'foto');
//     const carnetidentidad = req.files.find(file => file.fieldname === 'carnetidentidad');
//     const hojaDeVida = req.files.find(file => file.fieldname === 'hojaDeVida');
//     const antecedentes = req.files.find(file => file.fieldname === 'antecedentes');
//     const documentosVehiculo = req.files.find(file => file.fieldname === 'documentosVehiculo');
//     const licenciaConducir = req.files.find(file => file.fieldname === 'licenciaConducir');
//     const imagenSeguro = req.files.find(file => file.fieldname === 'imagenSeguro');

//     // Subir las imágenes a Cloudinary
//     const fotoUrl = await subirImagen(foto);
//     const carnetIdentidadUrl = await subirImagen(carnetidentidad);
//     const hojaDeVidaUrl = await subirImagen(hojaDeVida);
//     const antecedentesUrl = await subirImagen(antecedentes);
//     const documentosVehiculoUrl = await subirImagen(documentosVehiculo);
//     const licenciaConducirUrl = await subirImagen(licenciaConducir);
//     const imagenSeguroUrl = await subirImagen(imagenSeguro);

//     const contraseñaHash = await encrypt(contrasena);

//     const createDriver = await Driver.create({
// 		nombre,
// 		contraseña: contraseñaHash,
// 		correo,
// 		edad,
// 		foto: fotoUrl,
// 		direccion,
// 		carnetidentidad: carnetIdentidadUrl,
// 		hojaDeVida: hojaDeVidaUrl,
// 		antecedentes: antecedentesUrl,
// 		numeroCuenta,
// 		documentosVehiculo: documentosVehiculoUrl,
// 		licenciaConducir: licenciaConducirUrl,
// 		imagenSeguro: imagenSeguroUrl,
// 		tipoDeViaje,
// 		vehiculoAsegurado,
// 	  });
	  

// 		///// notificación por mail - usuario registrado

// 		// const asunto = 'Bienvenida a Sora';

// 		// const texto = `<p>Hola ${nombre}!<br><br>Estamos muy felices de recibirte en Sora!<br><br>A partir de ahora vas a poder usar nuestro servicio y viajar feliz y segura!<br><br>
// 		// 				<br><br>Nos vemos!</p>`;

// 		// mailUsuarioCreado(correo, asunto, texto);

// 		/////////

// 		res.status(200).send({createDriver, tipo: "conductora"});
// 	} catch (error) {
// 		console.log(error)
// 	  res.status(400).send({ error: error.message });
// 	}
//   });

router.post('/registro', async (req, res) => {

	const { nombre, correo, contraseña, edad, direccion, numeroCuenta, tipoDeViaje, vehiculoAsegurado, foto, carnetidentidad, hojaDeVida, antecedentes, documentosVehiculo, licenciaConducir, imagenSeguro } = req.body;
  
	try {
		// Verifica si la conductora ya existe
		const conductoraExistente = await Driver.findOne({ where: { correo } });
		if (conductoraExistente) {
		  return res.status(400).send({ error: 'El correo ya está registrado' });
		}

		const contraseñaHash = await encrypt(contraseña);


	// Crear el registro del conductor en la base de datos
    const createDriver = await Driver.create({
		nombre,
		foto,
		contraseña: contraseñaHash,
		correo,
		edad,
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
	  });
  
	  res.status(200).send({createDriver, tipo: "conductora"});
	} catch (error) {
		console.log(error)
	  res.status(400).send({ error: error.message });
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
