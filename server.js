import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
const PORT=process.env.PORT||3000;
const uploadDir=path.join(__dirname,"uploads");
const outputDir=path.join(__dirname,"outputs");
fs.mkdirSync(uploadDir,{recursive:true});
fs.mkdirSync(outputDir,{recursive:true});
app.use(express.static(path.join(__dirname,"public")));
app.use("/outputs",express.static(outputDir));

const upload=multer({
  dest:uploadDir,
  limits:{fileSize:12*1024*1024},
  fileFilter:(_req,file,cb)=>{
    const ok=["image/jpeg","image/png","image/webp"].includes(file.mimetype);
    cb(ok?null:new Error("Please upload a JPG, PNG, or WEBP image."),ok);
  }
});

app.get("/api/status",(_req,res)=>res.json({configured:Boolean(process.env.OPENAI_API_KEY)}));

app.post("/api/edit",upload.single("photo"),async(req,res)=>{
  const inputPath=req.file?.path;
  try{
    if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"Server setup incomplete: add OPENAI_API_KEY in Render Environment."});
    if(!req.file)return res.status(400).json({error:"Upload a photo first."});
    const prompt=String(req.body.prompt||"").trim();
    if(!prompt)return res.status(400).json({error:"Enter an image prompt."});
    if(prompt.length>2000)return res.status(400).json({error:"Prompt must be 2000 characters or less."});
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const result=await client.images.edit({
      model:"gpt-image-1",
      image:fs.createReadStream(inputPath),
      prompt,
      size:"1024x1024"
    });
    const b64=result.data?.[0]?.b64_json;
    if(!b64)throw new Error("The image service did not return an image.");
    const filename=`${Date.now()}-${crypto.randomBytes(5).toString("hex")}.png`;
    fs.writeFileSync(path.join(outputDir,filename),Buffer.from(b64,"base64"));
    res.json({imageUrl:`/outputs/${filename}`,filename});
  }catch(err){
    console.error("Image generation error:",err?.message||err);
    const message=err?.status===401?"API key is invalid. Check Render Environment."
      :err?.status===429?"API quota/rate limit reached. Check API billing and usage."
      :(err?.message||"Image generation failed.");
    res.status(500).json({error:message});
  }finally{
    if(inputPath&&fs.existsSync(inputPath))fs.unlinkSync(inputPath);
  }
});
app.use((err,_req,res,_next)=>{
  if(err instanceof multer.MulterError&&err.code==="LIMIT_FILE_SIZE")return res.status(413).json({error:"Image must be 12 MB or smaller."});
  res.status(400).json({error:err.message||"Upload failed."});
});
app.listen(PORT,()=>console.log(`Prompt Photo Studio AI running on port ${PORT}`));