const {DataTypes} = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define('user', {
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
		correo: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		foto: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		dni: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		fotoDni: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contraseña: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		genero: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true,
		},

	},
	{ timestamps: false }
	);
};
