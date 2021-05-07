const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    follower:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    photo:{
        type:String
    },
    bio:{
        type:String
    },
    resetToken:String,
    expireToken:Date
});

mongoose.model("User", UserSchema);