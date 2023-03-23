import express from "express"
import { MongoClient } from "mongodb"
import cors from "cors"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()
import generator from 'generate-password'
import { auth } from "./auth/auth.js"
import http from 'http'
import { Server } from "socket.io"
import userRouter from "./routes/user.route.js"
import autogenRouter from "./routes/autogen.route.js"

const app= express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'https://super-tapioca-5273dd.netlify.app',
        methods:['GET','POST']
    }
})
// mongoDB connection
const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL)
client.connect()




app.use(cors())
const PORT = process.env.PORT

app.use(express.json())


app.use("/user",userRouter)

app.use("/autogenpassword",autogenRouter)



io.on('connection',(socket)=>{
    
    socket.on('join-room',(data)=>{
        
        socket.join(data)
    })

    socket.on('send-message',(data)=>{
        socket.to(data.room).emit('receive-message',data)
    })

    socket.on('send-roomname',(data)=>{
        socket.to(data.room).emit('receive-roomname',data)
    })

    socket.on('disconnect',()=>{
        
    })
})
server.listen(PORT)

export{jwt,bcrypt,client,auth,generator}
