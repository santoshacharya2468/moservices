const mongoose=require("mongoose");
const UserSchema=mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    registerdat:{
        type:Date,
        default:Date.now,
    },
    isAdmin:{
        default:false,
        type:Boolean

    },
    email_verified:{
        type:Boolean,
        default:false,
    },
   token:{
       type:String,

   },
   accountToken:{
       type:String,
   }

});
module.exports=mongoose.model("User",UserSchema);