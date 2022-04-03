const nodemailer=require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const username= process.env.MAIL_USER;
const password=process.env.MAIL_PASS;
const host=process.env.SMTP_HOST;
const port= process.env.SMTP_PORT;
async function sendMail({from, to, subject,text,html}){
        let transporter=nodemailer.createTransport({
            host: host,
            port:port,
            secure:false,
            auth:{
                user:username,
                pass: password,
            }

        });
        
        let info=await transporter.sendMail({
            from:`file sharing website <${from}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(info);

}

module.exports=sendMail