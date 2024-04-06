const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const {db} = require("../utils/DB.js")

const signUp = async (req, res) => {
    // console.log(req.body)
    const { name, email, pwd, image } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.json({ status: "failure" });
        }
        if (results.length > 0) {
            return res.json({ status:"failure",error: "User already exists" });
        } else {
            // const hashedPassword = await bcrypt.hash(pwd, 10);
            const insertQuery = "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)";
            db.query(insertQuery, [name, email, pwd, image], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({  status:"failure",error: "Internal server error" });
                }
                const token = JWT.sign({ email }, "annapavananna", { expiresIn: '1h' });
                return res.status(201).json({ status: "success", token });
            });
        }
    });
};


const signIn = async (req, res) => {
    const {email, password } = req.body;
    // console.log(email,"---------maillllllll")
    const query = `select * from users where email = ?`;
    // console.log(query);
    db.query(query,[email], async (err,results) => {
        // console.log(results);
        if(err){
            return res.json({status:"failure"});
        }
        if(results.length ==0 ){
            console.log("no user");
            return res.json({status:"failure"});
        }

        const user = results[0];
        const hashedPassword = user.password;

        if(password == hashedPassword){
            // console.log("Matched")
            const token = JWT.sign({ email }, "ANNA", { expiresIn: '1h' });

            return res.json({status: "success",email, token});
        }else{
            console.log("not matches")
            return res.json({status:"failure"});

        }

    })
}

const verifyToken = async (req,res) => {
    const token = req.params.id;
    try {
        // Verify the token using JWT.verify
        // console.log("aaaaaaaaanna")
        // console.log(token);
        const decoded = JWT.verify(token, "ANNA");
        // console.log("after  verification");
        // Extract email from the decoded token payload
        const email = decoded.email;
        
        // Return the email
        return res.json({ status: "verified", email });
    } catch (err) {
        // If token is invalid, catch the error and return "token invalid"
        console.error("Token verification failed:", err);
        res.json({ status: "invalid" });
    }
};




module.exports = { signUp ,signIn, verifyToken};
