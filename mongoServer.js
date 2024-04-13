const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const routes = require("./routes/index.js")
const {config} = require("./config/index.js")

app.use(express.json());

app.use(cors());

(async () => {
  try {
    await mongoose.connect(config.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();


app.use("/api",routes);

app.get("/",(req,res)=> {
  return res.json("Backend File")
}) 

const PORT = process.env.PORT || 8091;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
