const {DataTypes} = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('driver', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		foto: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contraseña: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		correo: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		edad: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		direccion: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		carnetidentidad: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		hojaDeVida: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		antecedentes: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		numeroCuenta: {
			type: DataTypes.INTEGER,
			allowNull: false
		  },
		documentosVehiculo: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		licenciaConducir: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		imagenSeguro: {
			type: DataTypes.TEXT,
			allowNull: false
		  },
		tipoDeViaje: {
			type: DataTypes.ARRAY(DataTypes.TEXT),
			allowNull:false
		  },
		vehiculoAsegurado: {
			type: DataTypes.ENUM(
			  "si",
			  "no"
			),
			defaultValue: null,
			allowNull: false,
			validate: {
			  isIn: [["si",
			  "no"]],
			},
		  },
	},
	{ timestamps: false }
	);
};