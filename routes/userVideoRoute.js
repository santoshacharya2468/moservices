const express = require("express");
const router = express.Router();
var path = require("path");
var appDir = path.dirname(require.main.filename);
const Shop=require("../models/shop");
const multer = require("multer");
const authorization = require("../middlewares/authorization");
const isAdmin=require("../middlewares/isAdmin");
const hasShop = require("../middlewares/hasShop");
const fs=require("fs");
const perPage = 20;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname=="interviewvideo"){
      cb(null, appDir + "/public/interview");
    }
    else{
      cb(null, appDir + "/public/interview/thumbnails");
    }
    
  },
  filename: (req, file, cb) => {
    if(file.fieldname=="interviewvideo"){
      let filename = Date.now() + "_" + file.originalname;
    req.video = "/public/interview/" + filename;
    cb(null, filename);
    }
    else{
      let filename = Date.now() + "_" + file.originalname;
    req.thumbnail = "/public/interview/thumbnails/" + filename;
    cb(null, filename);
    }
    
  },
});
const upload = multer({ storage: storage });
const Video = require("../models/videoInteview");
const { Mongoose } = require("mongoose");
router.get("/", async (req, res) => {
  var page = req.query.page || 1;

  try {
    var videos = await Video.find()
      
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
      .populate({path:"shop",populate:{path:"category"}});
      
    if ((await Video.count()) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.status(200).json({ videos: videos, next: nextPage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//to create a new deal;
router.post(
  "/",
  authorization,
  isAdmin,
  upload.fields([{name:"interviewvideo",maxCount:1},{name:'thumbnail',maxCount:1}]),
  async (req, res) => {
    req.body.videoLink = req.upload;
    let shop=await Shop.findById(req.body.shop);
    
    let video = new Video({thumbnail:req.thumbnail,videoLink:req.video,name:req.body.name,
      shop:shop});
    try {
      var result = await video.save();
      res.status(201).send(result);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
var appDir = path.dirname(require.main.filename);
router.delete("/:videoId",authorization,isAdmin,async(req,res)=>{
  let id=req.params.videoId;
    var video=await Video.findById(id);
    var vdideo=await  Video.findByIdAndDelete(id);
    try{
      fs.unlinkSync(appDir+video.videoLink);
    }
    catch(e){}
    
    try{
    
      fs.unlinkSync(appDir+video.thumbnail);
    }
    catch(e){}
 
    res.status(204).send();

});
router.patch("/like/:videoId",async(req,res)=>{
  let id=req.params.videoId;
    var video=await Video.findById(id);
    await  Video.findByIdAndUpdate(id,{likes:video.likes+1});
    res.send(await Video.findById(id));
});
router.patch("/share/:videoId",async(req,res)=>{
  let id=req.params.videoId;
    var video=await Video.findById(id);
    await  Video.findByIdAndUpdate(id,{shares:video.shares+1});
    res.send(await Video.findById(id));
});
router.patch("/view/:videoId",async(req,res)=>{
    let id=req.params.videoId;
    var video=await Video.findById(id);
    await  Video.findByIdAndUpdate(id,{views:video.views+1});
    res.send(await Video.findById(id));
});
module.exports = router;
