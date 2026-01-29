const mongoose = require("mongoose")
require("dotenv").config()

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_CONNECT)
        console.log("DB Connected!")

    } catch(err) {
        console.log("error")

    }
}

module.exports = dbConnect