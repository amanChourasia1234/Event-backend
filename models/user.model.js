import sequelize from "../config.js";
import { DataTypes } from "sequelize";
const User = sequelize.define("user",{
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }

// },{
    
    // defaultScope: {
    //     attributes: {
    //         exclude: ["password"]
    //     }
    // }
      
// 
}
)

export default User;