const {Router} = require('express');
const router = Router();
const {Viaje, User, Driver} = require('../db');


router.post('/viaje', async (req, res) => {
  
  //agreagr fecha

	const {userCorreo, estado, montoTotal, distancia, fecha} = req.body;

        try {
		
            const createTravel = await Viaje.create({
              userCorreo,
              estado,
              montoTotal,
              distancia,
              fecha,
              estado: "en espera"   
            });
    
            res.status(200).send(createTravel, console.log("viaje creado"));
        } catch (error) {
            res.status(400).send({error: error.message});
        }
      

});

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

router.get("/user/:correo", async (req, res) => {
		try {
		  const { correo } = req.params;
		  const userId = await Viaje.findAll({
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

router.get("/conductora/:correo", async (req, res) => {
      try {
        const { correo } = req.params;
        const userId = await User.findAll({
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

router.put("/editarViaje", async (req, res) => {

  const{id} = req.params

  const { userCorreo, driverCorreo, estado } = req.body;

  const viajeActualizado = {
    userCorreo,
    driverCorreo,
    estado,
  };
  
  const viajeEcontrado = await Driver.findOne({
    where: {
      id: id,
    },
  });
  
  await viajeEcontrado.update(nuevaConductora, { where: { correo: correo } });
  await viajeEcontrado.save();

  res.status(200).send(viajeEcontrado);
  });


    module.exports = router;