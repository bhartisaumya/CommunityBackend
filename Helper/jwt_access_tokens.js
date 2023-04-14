const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const User = require('../Models/User.model')

module.exports = {
    signAccessToken : (userId) => {
        return new Promise((resolve , reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_KEY
            const option = {
                expiresIn : '5h',
                issuer : 'Surya',
                audience : userId,
            }
            JWT.sign(payload , secret , option , (err , token) => {
                if(err){
                    console.log(err.message)
                    // return reject(err)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken : (req , res , next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token , process.env.ACCESS_TOKEN_KEY , async (err , payload) => {
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            req.ownerId = payload.aud
            next();
        })
    },
    signRefreshToken : (userId) => {
        return new Promise((resolve , reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_KEY
            const option = {
                expiresIn : '1y',
                issuer : 'Surya',
                audience : userId,
            }
            JWT.sign(payload , secret , option , (err , token) => {
                if(err){
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyRefreshToken : (refreshToken) => {
        return new Promise((resolve , reject) => {
            JWT.verify(refreshToken , process.env.REFRESH_TOKEN_KEY , (err , payload) => {
                if(err) return reject(createError.Unauthorized())

                const userId = payload.aud
                resolve(userId)
                req.payload = payload
                next()
            })
        }) 
    } 
}