import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Event = sequelize.define("event",{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
    },
    location:{
        type:DataTypes.STRING,
        allowNull:DataTypes.STRING
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    uploadedFile:{
        type:DataTypes.STRING,
    }
})

export default Event;