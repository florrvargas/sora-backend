const {Router} = require('express');
const router = Router();
require('dotenv').config();


// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
const { MP_ACCESS_TOKEN} = process.env

const api = MP_ACCESS_TOKEN
mercadopago.configure({
  access_token: "APP_USR-2279641353678271-042500-9ea457cb9c2fd06842fc0c3833bb91ab-1360165492" ,
});

// Endpoint para crear un pago

router.post("/", (req, res) => {
	const { costo} = req.body
// Crea un objeto de preferencia
let preference = {
	items: [
	  {
		title: "Su viaje",
		unit_price: parseInt(costo),
		quantity: 1,
	  },
	],
	"back_urls": {
        "success": "http://localhost:5173/perfil/viajes/success",
        "failure": "http://localhost:5173/perfil/viajes/failure",
        "pending": "http://localhost:5173/perfil/viajes/pending"
    },
    "auto_return": "approved",
  };
  
  mercadopago.preferences
	.create(preference)
	.then(function (response) {
	res.redirect(response.body.init_point)
	})
	.catch(function (error) {
	  console.log(error);
	});
  
})


module.exports = router;
