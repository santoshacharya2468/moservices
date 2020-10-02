const mongoose=require("mongoose");
const visitSchema=mongoose.Schema({
    name:{
        type:String,
    },
    videoLink:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    shop:{
        type:mongoose.Types.ObjectId,
        ref:"Shop",
        required:true,
    },
    likes:{
        type:Number,
        default:0,
    },
    views:{
        type:Number,
        default:0,
    },
    shares:{
        type:Number,
        default:0,
    },
    date:{
        type:Date,
        default:Date.now,
    },

});
module.exports=mongoose.model("Video",visitSchema);
