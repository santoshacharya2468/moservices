const mongoose = require("mongoose");
const shopSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  businessName: {
    type: String,
    required: true,
    unique: true,
  },

  businessLogo: {
    type: String,
    required: true,
  },
  address: [
    {
      type: String,
      required: true,
    },
  ],
  district: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    // required: true,
  },
  facebook: {
    type: String,
    // required: true,
  },
  mobiles: [
    {
      type: String,
      required: true,
    },
  ],
  telephones: [
    {
      type: String,
      // required: true,
    },
  ],
  activated: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  shopDescription: {
    type: String,
  },
 
  banner: {
    showDiscount: { type: Boolean, default: false },
    colorIndex: { type: Number, default: 0 },
    isDefault :{ type: Boolean, default: true },
    showNumber :{ type: Boolean, default: true },
    showProfile :{ type: Boolean, default: true },
    showFb :{ type: Boolean, default: true },
    showWebsite :{ type: Boolean, default: true },
    profilePicture: {type: String,},
    profileVideo: {type: String,},
    thumbnail:{type:String},
    discountPercent: {
      type: Number,
    },
  },
  updatedDate: {type: Date,default: Date.now,},

});
shopSchema.index({businessName: 'text', shopDescription: 'text',website:'text',mobiles:'text',telephones:"text"});

module.exports = mongoose.model("Shop", shopSchema);
