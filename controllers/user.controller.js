import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import { where } from "sequelize";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodeMailer from "nodemailer"
import InvitedUser from "../models/invitedUser.model.js";
import dotenv from "dotenv/config"

const otp = Math.floor(1000+Math.random()*1000);

User.hasMany(Event)
Event.belongsTo(User)
Event.hasMany(InvitedUser)
InvitedUser.belongsTo(Event)

const register = async(req,res)=>{

    const { username,email,password} = req.body;

    const existUsername = await User.findOne({
        where:{
            username:username
        }
    })
    if(existUsername){
        return res.status(400).json({msg:"Username already exist"})
    }
    const existEmail = await User.findOne({
        where:{
            email
        }
    })

    if(existEmail){
        return res.status(400).json({msg:"Email Already exist"})
    }
    const encryptedPassword = await bcrypt.hash(password,10)
    const createdUser = await User.create(
        {
            username:username,
            email:email,
            password:encryptedPassword
        },
    ).then(result=>{
        // console.log("Result",result)
        res.status(200).json({
            id:result.id,
            username:result.username,
            email:result.email,

        })
    }).catch(error=>{
        res.status(500).json(error)
    })
    console.log(createdUser);
}
const login = async(req,res)=>{
    
    const {username,password} = req.body;

    const checkUsername = await User.findOne({
        where:{
            username:username
        }
    })
    if(!checkUsername){
        return res.status(400).json({msg:"Invalid Username"})
    }
    const user = await User.findOne({
        where:{
            username:username
        }
    })
    const isPasswordValid =await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({msg:"Invalid Password"})
    }
    
    try {
        const token =jwt.sign(
            {id:user.id},
            process.env.SECRET_KEY,
            {expiresIn:"1h"}
        )

        const options = {
            httpOnly:true,
            secure:true
        }
        
        return res
        .status(200)
        .cookie("token",token,options).json({
            msg:"Login Successfully",
            token
        })
        
        

    } catch (error) {
        res.status(500).json({msg:error})
    }

}
const logOut = async(req,res)=>{
    try {
        const options = {
            httpOnly:true,
            secure:true
        }
    console.log("Before Logout : ",res.cookie())
        return res
        .status(200)
        .clearCookie("token",options)
        .json(
            {msg:"Logout Successfully"}
        )
        
    } catch (error) {
        return res.status(500).json(error.message)
    }

}
const forgetPassword = async(req,res)=>{
    const { email } = req.body;
    const isEmailValid = await User.findOne({
        where:{
            email
        }
    })
    if(!isEmailValid){
        return res.status(200).json({msg:"Email Not Valid"})
    }

    console.log(otp);

    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'carmine.rice@ethereal.email',
                pass: 'qE7fyxhEbkEfGTUXF4'
            }
        });
        const mailOptions = {
            from: 'lessie.raynor@ethereal.email',
            to: req.body.email,
            subject: 'Password reset OTP',
            text: `Your OTP For Reseting New Password is : ${otp}`,
        };
        await transporter.sendMail(mailOptions,(error,info)=>{
            if(!error){
                return res.status(200).json({msg:"Otp Sent Successfully"})
            }
        })
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}
const resetPassword = async(req,res)=>{
    
    const {newPassword,confirmNewPassword} = req.body;
    console.log("Email : ",req.query.email)
    console.log(otp);
    if(req.body.otp !== otp) {
        return res.status(400).json({msg:"Invalid OTP"})
    }

    if(newPassword !== confirmNewPassword){
        return res.status(400).json("Password Doesn't Match")
    }

    const encryptedPassword = awaitbcrypt.hash(newPassword,10);
    console.log("Encrypted PAssword  : ",encryptedPassword)
    const user = await User.findOne({
        where:{
            email:req.query.email
        }
    })
    const updatedPassword = await User.update(
        {
        password:encryptedPassword
        },
        {
            where:{
                id:user.id
            }
        }
    ).then(result=>{
        return res.status(200).json("Password updated Successfully")
    }).catch(error=>{
        return res.status(500).json(error.message)
    })

}
const updateUser = async(req,res)=>{
    if(!req.user){
        return res.status(400).json({msg:"Invalid Token"})
    }
    const user = await User.findByPk(req.user);
    // console.log("USer : ",user);
    const {username,email} = req.body;
    // const encryptedPassword = await bcrypt.hash(password,10);
    const updatedUser = await User.update(
    {
        username:username,
        email:email,
    },
    {
        where:{
            id:req.user
        }
    }).then(result=>{
        res.status(200).json(result)
    }).catch(error=>{
        res.status(500).json(error)
    })

}
const deleteUser = async(req,res)=>{
    // console.log("Request User in delete-user",req.user)
    const deletedUser = await User.destroy({
        where:{
            id:req.user
        }
    }).then(result=>{
        res.status(200).json(result)
    }).catch(error=>{
        res.status(500).json(error.message)
    })
}
const updatePassword = async(req,res)=>{
    const {oldPassword,newPassword}= req.body;
    const user = await User.findByPk(req.user);
    
    const isPasswordValid = await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordValid){
        return res.status(400).json({msg:"Password Not Valid"})
    }
    const encryptedPassword = await bcrypt.hash(newPassword,10);
    const updatedPassword = await User.update({
        password:encryptedPassword
    },
    {
        where:{
            id:req.user
        }
    }).then(result=>{
        return res.status(200).json({msg:"PAssword Updated Successfuly"})
    }).catch(error=>{
        return res.status(500).json(error.message)
    })


}

const getUsers = async (req, res) => {
    const page = req.query.page;
    let limit = 5;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            attributes:{
                exclude:['password','createdAt','updatedAt']
            }
        }).then(result=>{
            console.log(result)
            return res.status(200).json(result)
        }).catch(error=>{
            return res.status(500).json(error.message)
        })

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get Created and Invited User
const getUserWithEvent = async(req,res)=>{
    try {
        console.log("Request id  : ",req.user)

        const userWithEvent = await User.findAll({
            where:{
                id:req.user
            },
            attributes:{
                exclude:['password','createdAt','updatedAt']
            },
            include:[
                {
                    model:Event,
                    attributes:['id','name','description','uploadedFile']
                },
                
            ]
        }) 
        // if(userWithEvent.length > 0) {
        //     return res.status(200).json({message: "success", data: userWithEvent})
        // }    
        const user = await User.findByPk(req.user);
        console.log(user.email);
        const invationFromAnotherUser = await InvitedUser.findAll({
            where:{
                email:user.email
            },attributes:['eventId'],
            include:[
                {
                    model:Event,
                    attributes:['name','location','description','date'],
                
                }
            ]
        })
        return res.status(200).json({CreatedEvent:userWithEvent,Inviation:invationFromAnotherUser})
        // if(invationFromAnotherUser.length<1){
            
        // }else{
            
        //     return res.status(500).json({msg:"No Invitation Found"})
        // }

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message})
    }
}
    

//display created  event and  invition from other user
const allEventDetails = async(req,res)=>{
    const user = await User.findByPk(req.user);
    console.log(user.email);
    const invationFromAnotherUser = await InvitedUser.findAll({
        where:{
            email:user.email
        },attributes:['eventId'],include:[
            {
                model:Event,
                attributes:['name','location','description','date'],
            
            }
        ]
    })
    if(invationFromAnotherUser.length>0){
        return res.status(200).json({Inviation:invationFromAnotherUser})
        
    }else{
        
        return res.status(500).json({msg:"No Invitation Found"})
    }
    
}

//FILTER USER
const filterUser = async(req,res)=>{
    
    const user = await User.findAll(
        {where:req.query,attributes:['id','username','email']}
    ).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}

//SORTING USER
const sortingUser = async(req,res)=>{
    console.log(req.params.name)

    const user = await User.findAll(
        {
            order:[
                [req.params.name,"DESC"]
            ],attributes:['id','username','email']
        }
    ).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}


export {
    register,
    login,
    updateUser,
    deleteUser,
    logOut,
    updatePassword,
    getUsers,
    filterUser,
    sortingUser,
    getUserWithEvent,
    forgetPassword,
    resetPassword,
    allEventDetails
    // getEventDetails
}