import sequelize from "./config.js";
import express from "express";
import dotenv from "dotenv/config"
import router from "./routes/user.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT
app.use(helmet())
app.use(bodyParser.json())
app.use('/',router)
app.use(cookieParser())




sequelize.authenticate().then(()=>{
    console.log("Database Connected")
}).catch(error=>{
    console.log("Something went wrong while connecting database: ",error);
})

sequelize.sync().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is Listening on Port ${PORT}`)
    })
})