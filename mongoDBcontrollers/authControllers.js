const User = require("../models/UserSchema.js")
const JWT = require("jsonwebtoken")

const mongoSignUp = async (req,res) => {
    
    const { name, email, pwd, image } = req.body;
    // console.log(req.body)

    try{
        // console.log("stage 0 ")
        const existingUser = await User.findOne({email});
        // console.log("stage 1 ")
        if (existingUser) {
            return res.json({ status:'existed' });
        }
        // console.log("stage 2 ")

        const newUser = new User({name, email, pwd, image});
        // console.log("stage 3 ")
        await newUser.save();
        // console.log("stage 4 ")
        return res.status(201).json({status: 'success' })
    }catch(err){
        // console.log(err)
        return res.status(500).json({ err});
    }
}


const mongoLogin = async (req,res) => {
    const {email,password} = req.body;
    console.log(email)
    try{
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(401).json({ status: 'failure' });
        }
        const isPasswordMatched = await user.comparePassword(password)
        if(isPasswordMatched){
            return res.status(200).json({ status: 'success', email,token:user.getJWTtoken() });
        }else{
            return res.status(401).json({ status: 'failure' });
        }
    }catch(err){
        return res.status(500).json({ status: 'failure' });
    }
}

const mongoVerifyToken = async (req,res) => {
    const token = req.params.id;
    try {
        const decoded = JWT.verify(token, "ANNA");
        const email = decoded.email;
        return res.json({ status: "verified", email });
    } catch (err) {
        res.json({ status: "invalid" });
    }
}



module.exports = {mongoSignUp, mongoLogin ,mongoVerifyToken}