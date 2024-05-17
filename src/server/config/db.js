const mongoose = require('mongoose')

let Connectdb = async ()=>{

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect( 'mongodb+srv://marripallivishnuvardhan:ZFBLc1n4K4nXsg66@cluster0.zmtp1to.mongodb.net/kcea');
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        
    }
}

module.exports =Connectdb
