const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemberSchema = new Schema({
    communityid : {
        type : String,
        required : true,
    },
    userid : {
        type : String,
        required : true,
    },
    roleid : {
        type : String,
        required : true,
    },
    created_at : {
        type : String,
        required : false,
    }
})

const Member = mongoose.model('member' , MemberSchema);

module.exports = Member;