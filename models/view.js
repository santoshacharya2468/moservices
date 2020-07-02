const mongoose=require("mongoose");
const visitSchema=mongoose.Schema({
    visitDate:{
        type:Date,
        default:Date.now(),
    }
});
module.exports=mongoose.model("Visit",visitSchema);