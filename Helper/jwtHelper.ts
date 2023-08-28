import jwt from 'jsonwebtoken'

import createError from 'http-errors'
import dotenv from "dotenv"
dotenv.config()

const authModule = {
    signAccessToken: function (userId: string){
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET || "super Secret key";
            const options = {
                audience: userId,
                expiresIn: '1h',
                issuer: 'bhartiking.com'
            };
            jwt.sign(payload, secret, options, (err, token) => {
                if(err)
                    return reject(err)
                resolve(token)
            })
        })
    },

    signRefreshToken: function (userId: string): Promise<string>{
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET || "super Secret key";
            const options = {
                audience: userId,
                expiresIn: '1y',
                issuer: 'bhartiking.com'
            };
            jwt.sign(payload, secret, options, (err, token: any) => {
                if(err)
                    return reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: function(req: any, res: any, next: any){
        const authHeader = req.headers['authorization'];
        
        if(!authHeader)
            return next(createError.Unauthorized());

        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err: any, payload: any) => {
            if(err){
                const message = err.name == "JsonWebTokenError" ?
                         "Unauthorized" : err.message;

                return next(createError.Unauthorized(message));
            }
            
            // req.body.userId = payload.aud;
            console.log(req.body)
            next();
        })
    },
    verifyRefreshToken: function (refreshToken: string): Promise<string>{
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (err, payload: any) => {
                if(err)
                    return reject(createError.Unauthorized());

                const userId = payload.aud;
                resolve(userId)
            })
        })
    }
}

export default authModule;
