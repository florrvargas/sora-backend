const bcrypt = require("bcryptjs");

const encrypt = async (text) => {
  const hash = await bcrypt.hash(text, 10);
  return hash;
};

const compare = async (contraseña, hashContraseña) => {
  return await bcrypt.compare(contraseña, hashContraseña);
};

module.exports = { encrypt, compare };