const mongoose=require('mongoose');
require('dotenv').config();


const url=process.env.MONGO_CONNECTION_URL;
function connectDB(){
    main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(url);
    console.log('Database connected');
  
}

}

module.exports=connectDB;