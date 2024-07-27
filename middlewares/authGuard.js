const User = require("../models/User")
const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET

const authGuard = async (req, res, next) => {

    const authHeader = req.headers["authorization"]
    //Validando se o token vem da requisição
    const token = authHeader && authHeader.split(" ")[1]; //[1] Bearer hyyyauehuaehuaeh

    //check if header has a token
    if(!token) return res.status(401).json({errors: ["Acesso negado!"]})

    //check if token is valid

    try {
        //Valida se o token combina com o Secret
        const verified = jwt.verify(token, jwtSecret)

        //Tenta Identificar o Usuário e remove o password para poder trafégar sem a senha.
        req.user = await User.findById(verified.id).select("-password")

        next();
        
    } catch (error) {
        res.status(401).json({errors: ["Token Inválido"]})
    }

};

module.exports = authGuard;