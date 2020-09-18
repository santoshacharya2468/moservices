const express=require("express");
const router=express.Router();
const Category=require("../models/category");
const Like=require("../models/like");
const Visit=require("../models/view");
const Shop=require("../models/shop");
const Video=require("../models/videoInteview");
router.get("/dashboard",async(req,res)=>{
    try{
        var categoryCount=await Category.count();
        var likeCount=await Like.count();
        var clickCount=await Visit.count();
        var shopCount=await Shop.count();
        var videoCount=await Video.count();
        res.json({categories:categoryCount,likes:likeCount,clicks:clickCount,providers:shopCount,videos:videoCount});
    }
    catch(e){
        res.status(500).send({message:"Error retrieving dashboard"});
    }

});
module.exports=router;