
require("dotenv").config();

const config = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
    DIARYKEY: process.env.DIARYKEY,
    CONNECTION_URL: process.env.CONNECTION_URL
};

module.exports = { config };
