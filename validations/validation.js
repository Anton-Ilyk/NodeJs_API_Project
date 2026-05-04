const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(32),
        password:joi.string().required().min(6).max(148),
        firstname:joi.string().required().min(3).max(24),   
        lastname:joi.string().required().min(3).max(24)         
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(32),
        password:joi.string().required().min(6).max(148)        
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const schemaValidation = joi.object({
        title:joi.string().required().min(6).max(250),
        topics:joi.string().required().min(3).max(100),
        data:joi.string().required().min(6).max(2048),
        expiration_dt:joi.number()
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation