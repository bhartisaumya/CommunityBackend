import mongoose , { Schema } from 'mongoose';
import bycrypt from "bcrypt";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, lowercase: true, unique: true},
    password: {type: String, required: true}, 
});


UserSchema.pre("save" , async function(next){
    try{
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
        
    }catch (error: any){
        next(error);        
    }
})

UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean>{
    try {
        return bycrypt.compare(password, this.password);
    } catch (error) {
        throw error
    } 
}

const User = mongoose.model('user', UserSchema);

export = User;