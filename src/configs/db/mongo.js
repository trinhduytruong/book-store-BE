const mongoose = require('mongoose');
const {DB_NAME, DB_USER, DB_PWD} = require('../config');

const db_uri = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.joa4nds.mongodb.net/${DB_NAME}`;

async function connect(){

    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(db_uri);
        console.log('Connect successfully!');
    }catch(err){
        console.log(`Connect failed!. Error: ${err}`);
    }

}

module.exports = { connect };