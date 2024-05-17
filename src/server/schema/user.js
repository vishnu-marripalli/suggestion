const mongoose = require('mongoose')

const schema = mongoose.Schema;

const usermodel= new schema({
    type:{
        type:String,
        required:true,

    },
    user: {
        type: String,
        required: true,
        unique :true,
    },
    password: {
        type: String,
        required: true,
        unique :true,
    }



})

module.exports = mongoose.model('User', usermodel);;