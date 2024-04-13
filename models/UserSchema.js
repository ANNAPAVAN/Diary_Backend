const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true 
    },
    pwd:{
        type: String,
        required: true
    },
    image:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("pwd")) return next();
    try {
        const hashedPwd = await bcrypt.hash(this.pwd, 10);
        this.pwd = hashedPwd;
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods = {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.pwd)
    },

    getJWTtoken: function(){
        return  JWT.sign({_id:this._id , email:this.email}, "ANNA",{
            expiresIn:"30m"
        })
    }
}

module.exports = mongoose.model("diaryusers",userSchema);