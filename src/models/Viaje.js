const { DataTypes } = require("sequelize");
const { createDeflate } = require("zlib");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "viaje",
    {
      id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
      userCorreo: {
        type: DataTypes.STRING,
        allowNull:false
      },
      driverCorreo: {
        type: DataTypes.STRING,
        allowNull:true
      },
      estado: {
        type: DataTypes.ENUM(
          "realizado",
          "cancelado",
          "en proceso",
          "en espera"
        ),
        defaultValue: "realizado",
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["realizado", "cancelado", "en proceso","en espera"]],
        },
      },
      montoTotal: {
        type: DataTypes.FLOAT,
      },
      distancia: {
        type: DataTypes.STRING
      },
      fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        validate: {
          notEmpty: true,
          isDate: true,
        },
      },
    },
    { timestamps: false }
  );
};
