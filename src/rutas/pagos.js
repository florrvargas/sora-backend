const {Router} = require('express');
const router = Router();
require('dotenv').config();
const { Viaje} = require('../db');


// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
const {MP_ACCESS_TOKEN_FLORDEV, MP_ACCESS_TOKEN_FLORPROD, MP_ACCESS_TOKEN_GONZAPROD} = process.env
console.log( MP_ACCESS_TOKEN_FLORDEV)

mercadopago.configure({
  // //token dev
  // access_token: "APP_USR-2279641353678271-042500-9ea457cb9c2fd06842fc0c3833bb91ab-1360165492" ,
  // //token prod flor
  // access_token: "APP_USR-2515144582042803-042422-9007e48069daa0175684900819925b39-228591816" ,
  //token prod gonza
  access_token: "APP_USR-5891745819511612-062210-d1601aa80dd62369993464a1381586d5-138223204" ,
});

// Endpoint para crear un pago

router.post("/", async (req, res) => {
	const { montoTotal, userCorreo, distancia, duracion, origen, destino, origenLat,origenLng, destinoLat, destinoLng} = req.body
  console.log(userCorreo)
  console.log(montoTotal)
	try {

		const montoTotalFloat = parseFloat(montoTotal); // Convierte montoTotal a un número

		if (isNaN(montoTotalFloat)) {
		  throw new Error("El montoTotal no es un número válido");
		}

	// Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Su viaje",
          unit_price: montoTotalFloat,
          // unit_price: 1,
          quantity: 1,
        },
      ],
      "back_urls": {
        "success": "https://sora.travel/perfil/viajes/success",
        "failure": "https://sora.travel/perfil/viajes/failure",
        "pending": "https://sora.travel/perfil/viajes/pending"
      },
      "auto_return": "approved",
    };
  
    const response = await mercadopago.preferences.create(preference);

    // Almacena los datos del viaje en la base de datos
    const nuevoViaje = await Viaje.create({
      userCorreo: userCorreo,
      estado: "en espera",
      montoTotal: montoTotalFloat,
      distancia: distancia,
      duracion,
      origen,
      destino,
      origenLat,
      origenLng,
      destinoLat,
      destinoLng
    //   fecha: new Date(),
    //   pagoId: response.body.id, // Agrega el ID de pago proporcionado por Mercado Pago
    //   referenciaExterna: response.body.external_reference, // Agrega la referencia externa proporcionada por Mercado Pago
    });

    res.redirect(response.body.init_point);
  } catch (error) {
    console.error('Error al realizar el pago:', error);
	console.log(error)
    res.status(500).json({ message: 'Error al realizar el pago' });
  }
});


module.exports = router;
