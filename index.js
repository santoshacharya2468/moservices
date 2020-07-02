const express = require("express");
const mongoose = require("mongoose");
var morgan = require("morgan");
const path = require("path");
const Shop = require("./models/shop");
//middleware
const appMiddleware = require("./middlewares/appmiddleware");
//models
const User = require("./models/user");
// const dotenv = require("dotenv");
// dotenv.config();
const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.dbCon, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
app.use(morgan("tiny"));

app.listen(process.env.PORT || 8080,"192.168.1.143", () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

app.use(express.json());

//routes
const accountRoute = require("./routes/accountRoute");
const shopRoute = require("./routes/shopRoute");
const dealRoute = require("./routes/dealRoute");
const categoryRoute = require("./routes/categoryRoute");
const galleryRoute = require("./routes/workGalleryRoute");
const clickRoute = require("./routes/clickRoute");
const likeRoute = require("./routes/likeRoute");
const adminShopRoute=require("./routes/adminShopRoute");
const adminCategoryRoute=require("./routes/adminCategoryRoute");
const admin=require("./routes/adminDashBoard");
const authorization = require("./middlewares/authorization");
const bannerRoute=require("./routes/bannerRoute");
app.use("/account", appMiddleware, accountRoute);
app.use("/shop", appMiddleware, shopRoute);
app.use("/category", appMiddleware, categoryRoute);
app.use("/deal", appMiddleware, dealRoute);
app.use("/gallery", appMiddleware, galleryRoute);
app.use("/click", appMiddleware, clickRoute);
app.use("/like", appMiddleware, likeRoute);
app.use("/banner",bannerRoute);
//admin route
app.use("/admin-shop",adminShopRoute);
app.use("/admin-category",adminCategoryRoute);
app.use("/admin",authorization,admin);


//search route
app.get("/search/:query", async (req, res) => {
  //this route should be paginated
  try {
    var shops = await Shop.find({
      businessName: { $regex: req.params.query, $options: "i" },
      activated:true,
    })
      .populate("category")
      .limit(20);
    res.json(shops);
  } catch (e) {
    res.status(500).send({ message: "server error" + e.message });
  }
});
app.get("/admin-search/:query", async (req, res) => {
  //this route should be paginated
  try {
    var shops = await Shop.find({
      businessName: { $regex: req.params.query, $options: "i" },
    
    })
      .populate("category")
      .limit(20);
    res.json(shops);
  } catch (e) {
    res.status(500).send({ message: "server error" + e.message });
  }
});
app.get("/admin-search/:catId/:query", async (req, res) => {
  //this route should be paginated
  try {
    var shops = await Shop.find({
      businessName: { $regex: req.params.query, $options: "i" },
      category:req.params.catId
      
    })
      .populate("category")
      .limit(20);
    res.json(shops);
  } catch (e) {
    res.status(500).send({ message: "server error" + e.message });
  }
});
app.get("/provider/:shopId", async (req, res) => {
  //this route should be paginated
  try {
    var shop = await Shop.findById(req.params.shopId).populate("category");
    if (shop != null) {
      res.json(shop);
    } else {
      res
        .status(404)
        .send({ message: "A service provider with given id not  found" });
    }
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});
