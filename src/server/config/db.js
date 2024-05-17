const mongoose = require('mongoose')

let Connectdb = async ()=>{

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        
    }
}

module.exports =Connectdb