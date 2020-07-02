const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Visit=require("../models/view");
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    var visit=new Visit();
    await visit.save();
    res.json(categories);
  } catch (e) {
    res.status(500).send({ message: "Error retrieving categories" });
  }
});
module.exports=router;

