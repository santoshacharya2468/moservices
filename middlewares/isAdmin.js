const jsonwebtoken = require("jsonwebtoken");
const isAdmin = async function (req, res, next) {
  let jwtkey = req.headers["authorization"];
  if (jwtkey == null) {
    return res.status(401).json({ message: "Not authorized" });
  } else {
    try {
      var result = jsonwebtoken.verify(jwtkey, "53465FDSFf##%#%$%");
      var isAdmin=result.isAdmin||false;
      if(isAdmin){
        req.user = result;
        return next();
      }
      else{
        return res.status(401).json({ message: "Not authorized" });  
      }
     
     
    } catch (e) {
        return res.status(401).json({ message: "Not authorized" });  
    }
  }
};
module.exports = isAdmin;
