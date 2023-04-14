const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    created_at : {
        type : String,
        required : false,
    },
    updated_at : {
        type : String,
        required : false,
    }
})

const Role = mongoose.model('role' , RoleSchema);

module.exports = Role;