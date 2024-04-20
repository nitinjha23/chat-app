const mongoose = require('mongoose')

const  connectDB = async ()=>{
    try {
        
        const connect = await mongoose.connect("mongodb+srv://kumarnitindbg:Maapapa%4023@cluster0.tiqz3dh.mongodb.net/chatapp",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`MongoDB Connected : ${connect.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

module.exports = connectDB;