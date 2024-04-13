const {config} = require("../config/index.js")
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(config.DIARYKEY).digest('base64').substr(0, 32);
const Diary = require("../models/DiarySchema.js")


const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const mongoAddDiary = async (req, res) => {
    const { userMail, diaryContent, favoriteIncident, mood } = req.body;
    const todayDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-');


    const check = Diary.findOne({userMail,todayDate});
    if(!check){
        return res.json({status:"submitted"});
    }

    try{
        const encryptedDiaryContent = encrypt(diaryContent);
        const encryptedFavoriteIncident = encrypt(favoriteIncident);
    
        const newDiary = new Diary({
            userMail, diaryContent: encryptedDiaryContent, favoriteIncident: encryptedFavoriteIncident, mood , todayDate
        })
        await newDiary.save();
        res.status(201).json({status:"success"})
    }catch(err){
        res.json({status:"failure"})
    }
    
};

const mongoSelectDiary = async (req, res) => {
    const userMail = req.params.id;
    try {
        const diaries = await Diary.find({ userMail });
        const decryptedDiaries = diaries.map(diary => {
            return {
                diary: decrypt(diary.diaryContent), 
                fav: decrypt(diary.favoriteIncident),
                mood: diary.mood,
                ddate: diary.todayDate.slice(0, 10) 
            };
        });
        res.status(200).json(decryptedDiaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { mongoAddDiary, mongoSelectDiary };
