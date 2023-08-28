import mongoose from 'mongoose';
const Schema = mongoose.Schema


const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: false,
    },
    created_at: {
        type: String,
        required: false,
    },
    updated_at: {
        type: String,
        required: false,
    }
})

const Community = mongoose.model('community' , CommunitySchema);

export default Community;