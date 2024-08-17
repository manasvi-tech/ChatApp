import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Please enter your full name"]
    },
    username:{
        type:String,
        required:[true,"Please enter your username"],
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    profilePic:{
        type:String,
        default:""
    }
},
//createdAt, UpdatedAt => member since <createdAt>
{timestamps:true}
)

const User = mongoose.model("User",userSchema)

export default User;