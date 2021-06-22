const mongoose = require('mongoose');
const URL = "mongodb+srv://trabalho:12345@cluster0.xp0ej.mongodb.net/TeacherApp?etryWrites=true&w=majority"


const con = async function () {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    con: con
}