import express from "express";
import User from "../Model/userModel";
import createError from "http-errors"
import {registerSchema, loginSchema} from "../Helper/schemaValidation"
import authModule from "../Helper/jwtHelper"
import dotenv from "dotenv"
dotenv.config()
var router = express.Router();

// Register new member
router.post("/signin" , async (req , res , next) => {
    console.log(process.env.REFRESH_TOKEN_SECRET)
    try {
        const result = await registerSchema.validateAsync(req.body);

        const doesExist = await User.findOne({email: result.email})

        if(doesExist){
            throw createError.Conflict(`The ${result.email} already exists`);
        }

        const user = new User(result);
        const savedUser = await user.save();


        const aToken = await authModule.signAccessToken(savedUser.id);
        const rToken = await authModule.signRefreshToken(savedUser.id);

        res.status(201).json({AccessToken: aToken, RefreshToken: rToken});
        
    } catch (error: any){
        if(error.isJoi == true)
            error.status = 422;

        next(error);
    }  
})

//Login

router.post("/login", async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body);

        const doesExist = await User.findOne({email: result.email})

        if(!doesExist)
            throw createError.NotFound("User not found");

        const doesMatch = await doesExist.isValidPassword(result.password);

        if(!doesMatch){
            throw createError.Unauthorized("Password is invalid");  
        }

        const aToken = await authModule.signAccessToken(doesExist.id);
        const rToken = await authModule.signRefreshToken(doesExist.id);
        res.send({accessToken: aToken, refreshToken: rToken})

    } catch (error: any){
        if(error.isJoi == true)
            error.status = 422;
            
        next(error);
    }  
})


// Create new access and refresh token 

router.post("/newRefreshAccessToken", async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        if(!refreshToken)
            throw createError.Unauthorized();

        const userId = await authModule.verifyRefreshToken(refreshToken);

        const aToken = await authModule.signAccessToken(userId)
        const rToken = await authModule.signRefreshToken(userId)

        res.status(200).json({AccessToken: aToken, RefreshToken: rToken})
        
    } catch (error){
        next(error)        
    }
})



export = router;

