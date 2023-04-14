const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {MemberSchema} = require('../Helper/Validation_Schema')
const {verifyAccessToken} = require('../Helper/jwt_access_tokens')
const moment = require('moment')
const Member = require('../Models/Member.model')
const Community = require('../Models/Community.model')

// -> v1/member
// Add Member
router.post('/' , verifyAccessToken , async (req , res , next) => {
    console.log(req.body)
    try {
        const result = await MemberSchema.validateAsync(req.body)
        const {communityid} = req.body;
        const doesExist = await Community.findById(communityid)

        if(!doesExist) throw createError.Conflict(`Invalid Community id`);

        //console.log(result)
        if(doesExist.owner != req.payload.aud) throw createError.Unauthorized('User have no access to add as an Member')

        const created_at = moment().format();
        const {userid , roleid} = result

        const member = new Member({communityid , userid , roleid , created_at});
        const savedMember = await member.save()

        res.send(savedMember);

    } catch (error) {
        next(error);        
    }
})

// -> v1/member/:id
// Remove Member by id
router.delete('/' , verifyAccessToken , async (req , res , next) => {
    console.log(req.query.id)
    try {
        const result = await Member.findById(req.query.id)
        if(!result) throw createError.NotFound('Member not Found');

        const result2 = await Community.findById(result.communityid)
        if(!result2) throw createError.NotFound('Community Not Found')

        console.log(result2)
        console.log(req.ownerId)

        if(result2.owner != req.ownerId) throw createError.NotAcceptable('User have not access to delete the Member')

        const result3 = await Member.findByIdAndDelete(req.query.id)

        if(!result3) throw createError.InternalServerError();

    } catch (error) {
        next(error);        
    }
    console.log('deleted')
})

module.exports = router;

