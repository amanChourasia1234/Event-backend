import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import dotenv from "dotenv/config"
const verifyJWT = async(req,res,next)=>{
    
    
    try {
        
        let token = req.headers.authorization.split(" ")[1];
        const verifyJwt =  jwt.verify(token,process.env.SECRET_KEY)
        if(!verifyJwt){
            return res.status(400).json("Invalid Token")
        }
        const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        
        console.log(decodedToken)
        req.user = decodedToken.id
        next()

        // const decodedToken = jwt.verify(token,"SECRET_KEY");
        //     console.log("Decoded Token : " , decodedToken)
        // const user = User.findByPk(decodedToken.id).then(result=>{
        //     return res.status(200).json(result)
            
        // }).catch(error=>{
        //     return res.status(500).json(error.message)
        // })
        
        // if(!user){
        //         return res.status(400).json({msg:"User not Found"})
        // }
        
        // // req.email = user.email;
        // req.user = decodedToken.id;
        // req.token = token;
        // next()
    } catch (error) {
       return res.status(500).json(error.message)
    }
    
}

export default verifyJWT;