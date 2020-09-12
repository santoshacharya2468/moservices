const mongoose=require("mongoose");
const visitSchema=mongoose.Schema({
    title:{
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
    date:{
        type:Date,
        default:Date.now,
    },

});
module.exports=mongoose.model("Video",visitSchema);
