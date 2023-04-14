const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model')
const {authSchema , signinSchema} = require('../Helper/Validation_Schema')
const moment = require('moment')
const {signAccessToken , signRefreshToken , verifyAccessToken} = require('../Helper/jwt_access_tokens');


// -> v1/auth/signup
router.post('/signup' , async(req , res , next) => {
    try{
        const result = await authSchema.validateAsync(req.body)
        if(!result) throw createError.Unauthorized('Invalid Credentails')
        
        const doesExist = await User.findOne({email : result.email})
        if(doesExist) throw createError.Conflict(result.email + ' already Exists');

        const {name , email , password} = result;
        const created_at = moment().format();

        const user = new User({name , email , password , created_at});
        const savedUser = await user.save()

        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)
        res.send({accessToken , refreshToken});

    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error)
    }
})

// -> v1/auth/signin
router.post('/signin' , async(req , res , next) => {
    console.log(req.body)
    try {
        const result = await signinSchema.validateAsync(req.body)
        const user = await User.findOne({email : result.email})
        if(!user) throw createError.NotFound("User not registerd");

        const isMatch = await user.isValidPassword(result.password)

        if(!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({accessToken , refreshToken})
        
    } catch (error) {
        //if(error.isJoi === true) return next(createError.BadRequest("Invalid Username / Password"))
        next(error)        
    }
    
})

// -> v1/auth/me
router.get('/me' , verifyAccessToken , async(req , res , next) => {
    console.log('Returned the Deatils if exists')
    const me = await User.findById(req.payload.aud)
    res.send(me);
})


module.exports = router;