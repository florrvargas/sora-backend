const {Router} = require('express');
const router = Router();
require('dotenv').config();
const { Viaje} = require('../db');


// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
const {MP_ACCESS_TOKEN_FLORDEV, MP_ACCESS_TOKEN_FLORPROD, MP_ACCESS_TOKEN_GONZAPROD} = process.env


mercadopago.configure({
  // //token dev flor
  // access_token: MP_ACCESS_TOKEN_FLORDEV ,
  // //token prod flor
  // access_token: MP_ACCESS_TOKEN_FLORPROD ,
    // //token prod gonza
  access_token: "APP_USR-5698623587224157-062312-ddb2951c866c61f0f509f723bdb690a5-138223204" ,

});

// Endpoint para crear un pago

router.post("/", async (req, res) => {
	const { montoTotal, userCorreo, distancia, duracion, origen, destino, origenLat,origenLng, destinoLat, destinoLng} = req.body
  console.log(userCorreo)
  console.log(montoTotal)
	try {

		const montoTotalFloat = parseFloat(montoTotal);

		if (isNaN(montoTotalFloat)) {
		  throw new Error("El montoTotal no es un número válido");
		}

	// Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Su viaje",
          unit_price:parseInt(montoTotalFloat),
          // unit_price: 1,
          quantity: 1,
        },
      ],
      // currency_id: "ARS", 
      currency_id: "CLP", 
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
	  console.log("ERRORRRRRRRRRR ", error)
    res.status(500).json({ message: `Error al realizar el pago, ${error}` });
  }
});


module.exports = router;
