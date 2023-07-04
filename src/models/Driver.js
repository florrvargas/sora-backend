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
			allowNull: true,
		},
		dni: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		direccion: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		carnetidentidad: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		hojaDeVida: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		antecedentes: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		numeroCuenta: {
			type: DataTypes.INTEGER,
			allowNull: true
		  },
		documentosVehiculo: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		licenciaConducir: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		imagenSeguro: {
			type: DataTypes.TEXT,
			allowNull: true
		  },
		tipoDeViaje: {
			type: DataTypes.ARRAY(DataTypes.TEXT),
			allowNull:true
		  },
		vehiculoAsegurado: {
			type: DataTypes.ENUM(
			  "si",
			  "no"
			),
			defaultValue: null,
			allowNull: true,
			validate: {
			  isIn: [["si",
			  "no"]],
			},
		  },
	},
	{ timestamps: false }
	);
};