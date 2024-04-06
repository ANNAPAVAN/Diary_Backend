const {config} = require("../config/index.js")
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(config.DIARYKEY).digest('base64').substr(0, 32);

const { db } = require("../utils/DB.js");

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

const addDiary = async (req, res) => {
    const { userMail, diaryContent, favoriteIncident, mood } = req.body;
    const todayDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-');

    const encryptedDiaryContent = encrypt(diaryContent);
    const encryptedFavoriteIncident = encrypt(favoriteIncident);

    const query = "INSERT INTO MyDiary (email, diary, fav, mood, ddate) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [userMail, encryptedDiaryContent, encryptedFavoriteIncident, mood, todayDate], (err, result) => {
        if (err) {
            return res.json({ status: "failure" });
        }
        return res.json({ status: "success" });
    });
};

const selectDiary = async (req, res) => {
    const mail = req.params.id;
    const query = "SELECT * FROM MyDiary WHERE email = ?";
    db.query(query, [mail], (err, results) => {
        if (err) {
            return res.json({ status: "failure" });
        }

        // Decrypt diary content before sending response
        const decryptedResults = results.map(result => {
            return {
                ...result,
                diary: decrypt(result.diary),
                fav: decrypt(result.fav)
            };
        });

        return res.json(decryptedResults);
    });
};

module.exports = { addDiary, selectDiary };


// -------------------------------------------------------------------------------------------------------------------


// const {db} = require("../utils/DB.js")

// const addDiary = async (req,res) => {
//     const {userMail, diaryContent , favoriteIncident , mood} = req.body;
//     // const todatDate = new Date().toISOString().slice(0, 10);
//     // const todayDate = new Date().toLocaleDateString('en-IN');
//     // const todayDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-');
//     const todayDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-');

 
//     console.log(todayDate);

//     const query = "INSERT INTO MyDiary (email, diary, fav, mood, ddate) VALUES (?, ?, ?, ?, ?)";
//     db.query(query,[userMail,diaryContent,favoriteIncident,mood,todayDate],(err,result)=>{
//         if(err){
//             return res.json({status:"failure"});
//         }
//         return res.json({ status: "success" });
//     })
// }

// const selectDiary = async (req,res) => {
//     const mail = req.params.id;
//     const query = "select * from MyDiary where email = ?";
//     db.query(query,[mail],(err,results)=> {
//         // console.log(results);
//         return  res.json(results);
//     })
// }

// module.exports = {addDiary,selectDiary}
