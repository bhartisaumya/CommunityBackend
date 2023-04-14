const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {communitySchema} = require('../Helper/Validation_Schema')
const moment = require('moment')
const Role = require('../Models/Role.model')

router.post('/' , async (req , res , next) => {
    try {
        const result = await communitySchema.validateAsync(req.body)
        const doesExist = await Role.findOne({name : result.name})

        if(doesExist) throw createError.Conflict(`${result.name} Role Already Exists`);

        const event = new Date();
        const created_at = moment().format();
        const updated_at = created_at;

        const {name} = result;

        const owner = req.ownerId;

        const role = new Role({name , created_at , updated_at});
        const savedRole = await role.save()

        res.send(savedRole);

    } catch (error) {
        next(error);        
    }
})

router.get('/' , async (req , res , next) => {
    const allRole = await Role.find({});
    res.send(allRole);
})

module.exports = router;

