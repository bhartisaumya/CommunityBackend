const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Community = require('../Models/Community.model')
const {communitySchema} = require('../Helper/Validation_Schema')
const {verifyAccessToken} = require('../Helper/jwt_access_tokens')
const moment = require('moment');
const Member = require('../Models/Member.model');


// -> v1/community/
// Returns all created community
router.get('/' , verifyAccessToken , async (req , res , next) => {
    console.log('second')
    const allCommunity = await Community.find({});
    res.send(allCommunity);
})


// -> v1/community/
// Creates new community
router.post('/' , verifyAccessToken , async (req , res , next) => {
    try {
        const result = await communitySchema.validateAsync(req.body)
        const doesExist = await Community.findOne({name : result.name})

        if(doesExist) throw createError.Conflict(`${result.name} already Exists`);

        const event = new Date();
        const created_at = moment().format();
        const updated_at = created_at;

        const {name} = result;

        const owner = req.payload.aud;

        const community = new Community({name , owner , created_at , updated_at});
        const savedComminity = await community.save()

        res.send(savedComminity);

    } catch (error) {
        next(error);        
    }
})


// -> v1/community/me/owner
// Returns all community where the requester is the owner
router.get('/me/owner' , verifyAccessToken , async(req , res , next) => {
    try {
        console.log(req.userid)
        const allOwnedCommunity = await Community.find({owner : req.ownerId})
        res.send(allOwnedCommunity)      
    } catch (error) {
        next(error)        
    }
})


// -> v1/community/me/member
// Resturns all community where the requester is the member
router.get('/me/member' , verifyAccessToken , async(req , res , next) => {
    try {
        console.log(req.userid)
        const result = await Member.find({userid : req.ownerId})
        if(!result) throw createError.NotFound("Not a member of any community")
        const data = [];

        for(let i = 0 ; i < result.length ; i++){
            try {
                const comm = await Community.findById(result[0].communityid);
                data.push(comm)             
            } catch (error) {
                next(error)                
            }
        }
        res.send(data)      
    } catch (error) {
        next(error)        
    }
})

// -> /v1/community/:id/members     // dont't know how to call this
router.get('/' , verifyAccessToken , async(req , res , next) => {
    try {
        const commid = req.query.id
        const result = await Member.find({communityid : commid});
        const data = []

        for(let i = 0 ; i < result.length ; i++){
            try {
                const comm = await Community.findById(result[0].communityid);
                data.push(comm)             
            } catch (error) {
                next(error)                
            }
        }
        res.send(data)
        
    } catch (error) {
        next(error)
    }
    console.log('first')
})

module.exports = router;

