const express = require("express");
const router = express.Router();
var path = require('path');
var fs = require("fs");
var appDir = path.dirname(require.main.filename);
const multer = require("multer");
const authorization = require("../middlewares/authorization");
const hasShop = require("../middlewares/hasShop");
const Shop = require("../models/shop");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, appDir + "/public/gallery");
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + "_" + file.originalname;
        req.upload = "/public/gallery/" + filename;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });
const WorkGallery = require("../models/work_gallery");
//to get all deals;
//should use pagination;
router.get("/:shopId", async (req, res) => {
    try {
        const gallery = await WorkGallery.find({ shop: req.params.shopId }).sort({ _id: -1 });
        res.json(gallery);
    }
    catch (e) {
        res.status(500).send({ message: "Error retrieving workgallery" });
    }
});
router.delete("/:galleryId", authorization, hasShop, async (req, res) => {
    try {
        const gallery = await WorkGallery.findById(req.params.galleryId);
        await WorkGallery.findOneAndRemove({ _id: req.params.galleryId, shop: req.shop });
        try {
            fs.unlinkSync(appDir + gallery.imageUrl);
            fs.unlinkSync(appDir+gallery.thumbnail);
        }
        catch (e) { }
        res.status(204).json(gallery);

    }
    catch (e) {
        res.status(500).send({ message: "Error delteting workgallery" + e });
    }
});
router.patch("/:galleryId", authorization, hasShop, async (req, res) => {
    try {
        await WorkGallery.findOneAndUpdate({ _id: req.params.galleryId, shop: req.shop },{caption:req.body.caption});
        const gallery = await WorkGallery.findById(req.params.galleryId);
        await Shop.findByIdAndUpdate({ _id: req.shop._id }, {updatedDate: Date.now() });
        res.send(gallery);
    }
    catch (e) {
        res.status(500).send({ message: "Error delteting workgallery" + e });
    }
});
router.delete("/admin/:galleryId", authorization,  async (req, res) => {
    try {
        const gallery = await WorkGallery.findById(req.params.galleryId);
        await WorkGallery.findOneAndRemove({ _id: req.params.galleryId });
        try {
            fs.unlinkSync(appDir + gallery.imageUrl);
            fs.unlinkSync(appDir+gallery.thumbnail);
        }
        catch (e) { }
        res.status(204).json(gallery);

    }
    catch (e) {
        res.status(500).send({ message: "Error delteting workgallery" + e });
    }
});
router.get("/", authorization, hasShop, async (req, res) => {
    try {
        const gallery = await WorkGallery.find({ shop: req.shop }).sort({ _id: -1 });
        res.json(gallery);
    }
    catch (e) {
        res.status(500).send({ message: "Error retrieving workgallery" });
    }
});
const sharp = require('sharp');
//to create a new deal;
router.post("/", authorization, hasShop, upload.single("image"), async (req, res) => {
    req.body.imageUrl = req.upload;
    req.body.shop = req.shop;
    let Gallery = new WorkGallery(
        req.body
    );
    try {
        var outputDir = "/public/gallery/thumbnails/" + Date.now() + req.file.originalname;
        sharp(req.file.path).resize(200, 200).toFile(appDir + outputDir, (err, resizeImage) => {
            if (err) {
                console.log("Error generating thumbnails");
            } else {
                console.log("thumbnails generated");
            }
        });
        Gallery.thumbnail = outputDir;
        var result = await Gallery.save();
        await Shop.findByIdAndUpdate({ _id: req.shop._id }, {updatedDate: Date.now() });
        res.status(201).send(result);
    }
    catch (e) {
        fs.unlinkSync(appDir + req.upload);
        res.status(400).send(e);
        
    }
});
module.exports = router;
