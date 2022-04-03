const express=require('express');
const app=express();
const path=require('path');
const connectDB=require('./config/db');

const cors=require('cors');

const  PORT=process.env.PORT||3000;


app.use(express.static('public'));
app.use(express.json());
connectDB();

//cors
const corsOptions={
    origin: process.env.ALLOWED_CLIENTS.split(',')
}

app.use(cors(corsOptions));
//engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

//Routes
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'));

app.get('/',(req,res)=>{
    res.render('index')
})
app.listen(PORT, console.log(`Listening on port ${PORT}.`));