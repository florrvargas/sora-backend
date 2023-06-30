const {Router} = require('express');
const router = Router();
const {Viaje, User, Driver} = require('../db');
const { Op } = require("sequelize");
const { messaging } = require('firebase-admin');

// Función para enviar la notificación a las conductoras
async function enviarNotificacionConductoras() {
  try {
    const conductoras = await Driver.findAll({ where: { disponible: true } });
    const tokens = [];
    conductoras.forEach((conductora) => {
      if (conductora.token) {
        tokens.push(conductora.token);
      }
    });

    if (tokens.length > 0) {
      const message = {
        notification: {
          title: 'Nuevo viaje en espera.',
          body: 'Hay un nuevo viaje esperando por una conductora.',
        },
        tokens: tokens,
      };

      const response = await messaging().sendMulticast(message);
      console.log('Notificación enviada a las conductoras:', response);
    }
  } catch (error) {
    console.error('Error al enviar la notificación a las conductoras:', error);
  }
}



router.post('/viaje', async (req, res) => {

	const {userCorreo, estado, montoTotal, distancia, fecha,origen, destino,duracion, origenLat,origenLng, destinoLat, destinoLng } = req.body;

  try {
    const createTravel = await Viaje.create({
      userCorreo,
      estado,
      montoTotal,
      distancia,
      fecha,
      estado,
      origen,
      destino,
      duracion,
      origenLat,
      origenLng, 
      destinoLat, 
      destinoLng,
    });

    if (estado === 'en espera') {
      await enviarNotificacionConductoras();
    }
    
    res.status(200).send(createTravel);
  } catch (error) {
      res.status(400).send({error: error.message});
  }
      

});

//trae todos los viajes (para admin)
router.get("/viajes", async (req, res) => {
	try {
		const viajes = await Viaje.findAll();
		if (!viajes.length) {
		res.status(400).send({ error: "No se encontraron viajes" });
		} else {
		res.status(200).send(viajes);
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

// trae los viajes en espera
router.get("/solicitudes", async (req, res) => {
  try {
    // Recupera los viajes realizados por la usuaria desde la base de datos
    const solicitudes = await Viaje.findAll({
      where: {
        estado: "en espera", 
      },
    });

    // Envía los viajes realizados como respuesta
    res.status(200).json({ viajes: solicitudes });
  } catch (error) {
    console.error("Error al obtener los viajes:", error);
    res.status(500).json({ message: "Error al obtener los viajes." });
  }
});

// trae los viajes por correo
router.get("/misViajes", async (req, res) => {
  try {
    const { userCorreo, driverCorreo, estado } = req.query;

    // Recupera los viajes realizados por la usuaria desde la base de datos
    const viajesRealizados = await Viaje.findAll({
      where: {
        [Op.or]: [
          {
            userCorreo: userCorreo,
            estado: estado,
          },
          {
            driverCorreo: driverCorreo,
            estado: estado,
          },
        ],
      },
    });

    // Envía los viajes realizados como respuesta
    res.status(200).json({ viajes: viajesRealizados });
  } catch (error) {
    console.error("Error al obtener los viajes realizados:", error);
    res.status(500).json({ message: "Error al obtener los viajes realizados" });
  }
});

router.put('/viajeSolicitado/:id', async (req, res) => {
  const { id } = req.params;
  const { estado, driverCorreo, codigoSeguridad } = req.body;
  console.log(driverCorreo)

  try {
    // Busca el viaje en la base de datos por su ID
    const viaje = await Viaje.findByPk(id);

    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado' });
    }

    // Actualiza el estado del viaje
 
    viaje.driverCorreo = driverCorreo;
    viaje.estado = estado;
    viaje.codigoSeguridad = codigoSeguridad;
    // viaje.codigoSeguridad = codigoSeguridad;
    await viaje.save();
    return res.status(200).json(viaje);
  } catch (error) {
    console.error('Error al actualizar el estado del viaje:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

router.get('/viajeSolicitado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el viaje en la base de datos por su ID
    const viaje = await Viaje.findByPk(id);

    if (viaje) {
      // Extrae las coordenadas de origen y destino del viaje
      const origen = {
        lat: viaje.origenLat,
        lng: viaje.origenLng,
      };
      const destino = {
        lat: viaje.destinoLat,
        lng: viaje.destinoLng,
      };
      return res.json(viaje);
    } else {
      return res.status(404).json({ mensaje: 'Viaje no encontrado' });
    }
  } catch (error) {
    console.error('Error al cargar los datos del viaje:', error);
    return res.status(500).json({ mensaje: 'Error al cargar los datos del viaje' });
  }
});
  
router.delete("/viajes/:id", async (req, res) => {

  const { id } = req.params;
    try {
      const conductora = await Driver.findOne({
        where: {
          id: id,
        },
        });

      if(conductora){
        await Driver.destroy({
          where: {
            id: id,
          },
          });
      }

      
      }catch (error) {
    res.status(400).json({ error: error.message });
  }
});



    module.exports = router;