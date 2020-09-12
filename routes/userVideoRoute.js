const express = require("express");
const router = express.Router();
var path = require("path");
var appDir = path.dirname(require.main.filename);
const multer = require("multer");
const authorization = require("../middlewares/authorization");
const isAdmin=require("../middlewares/isAdmin");
const hasShop = require("../middlewares/hasShop");
const perPage = 20;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appDir + "/public/interview");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "_" + file.originalname;
    req.upload = "/public/interview/" + filename;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
const Video = require("../models/videoInteview");
router.get("/", async (req, res) => {
  var page = req.query.page || 1;

  try {
    var videos = await Video.find()
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
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
  upload.single("interviewvideo"),
  async (req, res) => {
    req.body.videoLink = req.upload;
    let video = new Video(req.body);
    try {
      var result = await video.save();
      res.status(201).send(result);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
module.exports = router;
