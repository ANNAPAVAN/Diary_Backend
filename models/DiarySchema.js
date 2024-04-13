const mongoose = require("mongoose");

// email, diary, fav, mood, ddate

const diarySchema = new mongoose.Schema({
    userMail: { 
        type: String,
         required: true 
    },
    diaryContent: {
        type: String
    },
    favoriteIncident: { 
        type:String
    },
    mood:{
        type:String
    },
    todayDate:{
        type:String
    }
}, {timestamps:true})

module.exports = mongoose.model('mydiary',diarySchema)