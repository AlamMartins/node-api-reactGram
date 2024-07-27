const {validationResult} = require("express-validator")

const validate = (req, res, next) => {

    //Define as regras de validações
    const errors = validationResult(req)
 
    //Caso não seja detectado nenhum erro, avance.
    if(errors.isEmpty()){
        return next()
    }

    //Array para capturar os erros
    const extractedErrors = []

    //Iteração no erro e realiza a extração dos dados para o array extractedErrors;
    errors.array().map((err) => extractedErrors.push(err.msg))

    //Imprimindo o Erro.
    console.log("ERROR 'handleValidation.js': "+JSON.stringify(errors.array()))

    //Retornando o Erro.
    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = validate;