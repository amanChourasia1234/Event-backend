import { Sequelize } from "sequelize";
import dotenv from "dotenv/config"

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
        host:process.env.HOST,
        dialect:'mysql'
    }
)


export default sequelize;