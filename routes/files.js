const router=require('express').Router();
const multer=require('multer');
const path=require("path");
const File=require('../models/file');
const {v4:uuid4}=require('uuid');
require('dotenv').config();


let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),

    filename:(req,file,cb)=>{
        const uniqueName=  `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniqueName);
    }
})

let upload=multer({
    storage,
    limit:{fileSize:1000000* 100}
}).single('myfile');

router.post('/',(req,res)=>{
     //store file in upload
 upload(req,res,async(err)=>{
        // validate request
        if(!req.file){
            return res.json({error: 'All fields are required.'})
        }

        if(err){
            return res.status(500).send({error:err.message})
        }

        //store data in database
        const file=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        });
        const file_url=process.env.APP_BASE_URL;
        const response =await file.save();
        res.json({ file: `${file_url}files/${response.uuid}` });
                //http://localhost:3000/files/23453hjsdgfgj-234bhjkldjbld
    })

    

    //resonse=>LInk
})

router.post('/send',async(req,res)=>{
  
    const {uuid,emailTo, emailFrom}=req.body;

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:'ALl field are required'})
    }
    const file=await File.findOne({uuid:uuid});
    if(file.sender) {
        return res.status(422).send({ error: 'Email already sent once.'});
      }

    //get data from data base
 
    

    file.sender=emailFrom;
    file.receiver=emailTo;
    
    const response=await file.save();

    //send mail
    const urlLink=process.env.APP_BASE_URL
    const sendMail=require('../services/emailService');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'You can download your file from link given below',
        text:`${emailFrom} shared a file with you.`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${urlLink}files/${file.uuid}`,
            size: parseInt(file.size/1000)+ 'KB',
            expires:'24 hours'
        })
    });
  return res.send({success : true});

});
module.exports=router; 
