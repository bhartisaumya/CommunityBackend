const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommunitySchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    created_at : {
        type : String,
        required : false,
    },
    owner : {
        type : String,
        required : false,
    },
    updated_at : {
        type : String,
        required : false,
    }
})

const Community = mongoose.model('community' , CommunitySchema);

module.exports = Community;