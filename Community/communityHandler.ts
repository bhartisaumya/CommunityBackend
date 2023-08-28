import express from "express"
import authModule from "../Helper/jwtHelper"
import {communitySchema} from "../Helper/schemaValidation"
import communityModel from "../Model/communityModel"
import createError from "http-errors"
import moment from "moment"
const app = express()

// /createCommunity/

app.post("/createCommunity", authModule.verifyAccessToken, async(req, res, next) => {
    try {
        const result = await communitySchema.validateAsync(req.body)
        
        const dublicate = await communityModel.findOne({name: req.body.name});

        if(dublicate)
            throw createError.Conflict("The community already exists");

        const event = new Date();
        const created_at = moment().format();
        const updated_at = created_at;

        console.log(req)

        const {name, owner} = req.body;

        const community = new communityModel({name, owner, created_at, updated_at});
        const savedCommunity = await community.save()

        res.send(savedCommunity)        
    } catch (error) {
        next(error)
    }
})

export = app