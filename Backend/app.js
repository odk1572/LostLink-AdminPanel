
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})); 

const __dirname = path.resolve();


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import itemRouter from './routes/item.routes.js'
import claimRouter from './routes/claim.routes.js'

//routes declaration
app.use("/api/v1/auth", userRouter)
app.use("/api/v1/item", itemRouter)
app.use("/api/v1/claims", claimRouter)


app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
});



export { app }
