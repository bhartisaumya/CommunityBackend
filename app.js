const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./Helper/Init_mongoDB');
const {verifyAccessToken} = require('./Helper/jwt_access_tokens')
//require('./Helper/key_generator')

const AuthRoute = require('./Authentication/Auth.route');
const CommunityRoute = require('./Community/CommunityRoute')
const RoleRoute = require('./Moderation/RoleRoute')
const MemberRoute = require('./Moderation/MemberRoute')

const app = express();
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : true}));

app.use('/v1/auth' , AuthRoute);
app.use('/v1/community' , CommunityRoute);
app.use('/v1/role' , RoleRoute)
app.use('/v1/member' , MemberRoute)

app.use(async(req , res , next) => {
    next(createError.NotFound());
})

app.use((err , req , res , next)=> {
    res.status(404 || 500);
    res.send({
        error : {
            status : err.status || 500,
            message : err.message,
        }
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log(`Server Running on Port ${PORT}`);
})
