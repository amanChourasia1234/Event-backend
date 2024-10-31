import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const InvitedUser = sequelize.define("invitedUser",{
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    eventId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

export default InvitedUser;