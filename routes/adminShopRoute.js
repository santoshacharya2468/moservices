const Shop = require("../models/shop");
const authorization = require("../middlewares/authorization");
var fs = require("fs");
const perPage = 18;
const WorkGallery = require("../models/work_gallery");
const express=require("express");
const User=require("../models/user");
var path = require("path");
var appDir = path.dirname(require.main.filename);
const router = express.Router();
router.get("/", async (req, res) => {
  let page = req.query.page || 1;
  //this route should be paginated
  try {
    var shops = await Shop.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });

    if ((await Shop.count()) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.json({ data: shops, perPage: perPage, next: nextPage });
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});
router.get("/:catId", async (req, res) => {
  let page = req.query.page || 1;
  //this route should be paginated
  try {
    var shops = await Shop.find({ category: req.params.catId })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });
    if ((await Shop.count({ category: req.params.catId })) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.json({ data: shops, perPage: perPage, next: nextPage });
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});
//activate or deactivate a shop
router.patch("/:shopId",async(req,res)=>{
    try{
      await Shop.findByIdAndUpdate(req.params.shopId,{activated:req.body.status});
      res.send(await Shop.findById(req.params.shopId));
    }
    catch(e){
      res.status(500).send(e);
    }
  });
  //delete a shop with given  id
  router.delete("/:shopId",async(req,res)=>{
    try{
      var shop=await Shop.findById(req.params.shopId);
      await Shop.findByIdAndRemove(req.params.shopId);
      await User.findByIdAndRemove(shop.owner);
      res.status(204).send();
      const galleres = await WorkGallery.find({ shop: req.params.shopId});
      for(var i=0;i<datalength;i++){
        var gallery=galleres[i];
        try {
          fs.unlinkSync(appDir + gallery.imageUrl);
          fs.unlinkSync(appDir + gallery.thumbnail);
        } 
        catch (e) {}
      }
      try {
        fs.unlinkSync(appDir + shop.businessLogo);
      } catch (e) {}
      try {
        fs.unlinkSync(appDir + shop.banner.profilePicture);
      } catch (e) {}
      await WorkGallery.findOneAndRemove({shop: req.params.shopId});
    }
    catch(e){
      res.status(500).send(e);
    }
  });
  module.exports=router;