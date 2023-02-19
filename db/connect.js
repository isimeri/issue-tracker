const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('db connected...');
    } catch(e){
        console.log('some bad happen on db connect ', e);
        process.exit(1);
    }
}

module.exports = connectDB;