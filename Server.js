const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const app = express()

const routes = require("./routes/index.js");

app.use(express.json());
app.use(cors())


// console.log("two")
app.use("/api", routes);
 

app.get("/",(req,res)=> {
    return res.json("Backend File")
}) 

app.listen(8091, ()=>{
    console.log("running in port 8091")
})








// Host: sql6.freesqldatabase.com
// Database name: sql6696255
// Database user: sql6696255
// Database password: QKCVPC7WmM
// Port number: 3306
