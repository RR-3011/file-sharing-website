const router=require('express').Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res)=>{
    const link_url=process.env.APP_BASE_URL;
    try{
        const file=await File.findOne({uuid:req.params.uuid});

        if(!file){
            return res.render('download',{error:'Link has been expired'})
        }
        return res.render('download',{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size,
            downloadLink: `${link_url}files/download/${file.uuid}`
            //thhp://localhost:e000/files/download/shdk-dalkdfj;ldl;
        })
    }
    catch(err){
        return res.render('download',{error:'Something went wrong'})
    }

})


module.exports=router;