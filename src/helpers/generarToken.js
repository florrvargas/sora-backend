const jwt = require("jsonwebtoken");


const tokenSign = async (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            rango: usuario.rango
        },
        process.env.LLAVE,
    );
};

const verificarToken= async (token) => {
    try{
      return jwt.verify(token, process.env.LLAVE);
    }catch(error){
        return null
    }
}

module.exports = {tokenSign, verificarToken};