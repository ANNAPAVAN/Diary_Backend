
require("dotenv").config();

const config = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
    DIARYKEY: process.env.DIARYKEY
};

module.exports = { config };
