import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import { where } from "sequelize";
import InvitedUser from "../models/invitedUser.model.js";


User.hasMany(Event);
User.hasMany(InvitedUser)
Event.belongsTo(User)
Event.hasMany(InvitedUser)
InvitedUser.belongsTo(User)


const createEvent = async(req,res)=>{
    const {name,description,location,date} = req.body;
    const filePath = `C:/task/event/${req.file.path}`;
    if(!filePath){
        return res.status(400).json("Invalid File Path")
    }
    console.log("Uploaded File Path",filePath)
    const createdEvent = await Event.create({
        name,
        description,
        location,
        date,
        userId:req.user,
        uploadedFile:filePath
    }).then(result=>{
        return res.status(200).json({msg:"Event Created Successfully",result})
    }).catch(error=>{
        return res.status(500).json(error)
    })
}
const updateEvent = async(req,res)=>{
    // console.log("Request user in update event : ",req.user)
    const eventId = req.params.id;
    console.log("Request Params : " ,eventId)
    const updatedUser = await Event.update(req.body,{
        where:{
            id:eventId
        }
    }).then(result=>{
        res.status(200).json(result)
    }).catch(error=>{
        res.status(500).json(error)
    })
}
const getEvent = async(req,res)=>{ 
    const event = await User.findAll({
        where:{
            id:req.user
        },
        attributes:{
            exclude:['password','createdAt','updatedAt']
        }
        ,include:[
            {
                model:Event,
                attributes:['id','name','location','description']
            }
        ]
    }).then(result=>{
        // console.log("Results event id",result)
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}
const deleteEvent = async(req,res)=>{

    const user = await User.findByPk(req.user);
    console.log(user.eventId);
    if(req.user === user.eventId){
        const deletedEvent = await Event.destroy({
            where:{
                id:req.params.id
            }
        }).then(result=>{
            res.status(200).json(result)
        }).catch(error=>{
            res.status(500).json(error)
        })
    }
}

const getEventByPage = async(req,res)=>{
    const page = req.query.page;
    const limit = 5;
    const offset = (page-1)*limit;

    try {
        const {count , rows} = await Event.findAndCountAll({
            limit,offset,attributes:{
                exclude:['userId','createdAt','updatedAt']
            }
        }).then(result=>{
            return res.status(200).json(result)
        }).catch(error=>{
            return res.status(500).json(error.message)
        })
    
    } catch (error) {
        // rerurn res
    }
    

}
const downloadEventDocument = async(req,res)=>{
    
    const event = await Event.findByPk(req.params.id);

        res.download(event.uploadedFile,(err)=>{
            if(err){
                console.log("error : ",err)
            }else{
                console.log("File Downloaded Successfully")
            }
        });
}

//INVITE USER TO EVENT
const inviteUserToEvent = async(req,res)=>{
    const {email,eventId} = req.body;
    const inviteUser = await InvitedUser.create({
        email,
        eventId,
        userId:req.user,
        
    }).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })

}
const getEventById = async(req,res)=>{
    const id = req.params.id;
    const event = await Event.findAll({
        where:{
            id:id
        },
        attributes:{
            exclude:['userId','createdAt','updatedAt']
        },
        include:[
            {
                model:InvitedUser,
                attributes:['id','email']
            }
        ]
    }).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}
// const getEventWithUser = async(req,res)=>{
//     const events = await User.findAll({
//         where:{
//             id:req.user
//         },
//         include:[
//             {model:Event}
//         ]
//     }).then(result=>{
//         return res.status(200).json(resu)
//     }).catch(error=>{
//         return res.status(500).json(error.message)
//     })
// }

//FILTERING

const filterEvents = async(req,res)=>{
    console.log(req.query)
    const events = await Event.findAll(
        {
            where:req.query,
            attributes:['id','name','description','location','date']
        }
    ).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}

//SORTING
const sortingEvents = async(req,res)=>{
    console.log(req.params.name)
    const event = await Event.findAll({
        order:[
            [req.params.name,'DESC']
        ],attributes:['id','name','description','date','location']
    }).then(result=>{
        return res.status(200).json(result)
    }).catch(error=>{
        return res.status(500).json(error.message)
    })
}

const uploadFile = async(req,res)=>{
    console.log(req.file.path)
    const temp = req.file.path;
    
    console.log(`C:/task/event/${temp}`)
    
    return  res.status(200).json("File Uploaded")
}

export {
    createEvent,
    updateEvent,
    getEvent,
    deleteEvent,
    getEventById,
    getEventByPage,
    inviteUserToEvent,
    filterEvents,
    sortingEvents,
    uploadFile,
    downloadEventDocument
}

