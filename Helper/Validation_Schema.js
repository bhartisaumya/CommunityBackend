const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(2).required()
})

const signinSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(2).required()
})

const communitySchema = Joi.object({
    name : Joi.string().required(),
})

const MemberSchema = Joi.object({
    communityid : Joi.required(),
    userid : Joi.required(),
    roleid : Joi.required(),
})


module.exports = {
    authSchema,
    communitySchema,
    signinSchema,
    MemberSchema
}