import express from "express"
import { jwt,bcrypt,auth} from "../index.js"
import { createUsers, getUser, deleteToken,getTokens,tokens } from "../service/user.service.js"

var Router = express.Router()

// bcrypt
async function genHashedPassword (password){
    const NO_OF_ROUND = 10
    const salt = await bcrypt.genSalt(NO_OF_ROUND)
    const hashed_password =await bcrypt.hash(password,salt)
    return hashed_password
    }

//creating user in database
async function createUser(userDetails){
    const user = await createUsers(userDetails)
   // returning boolean value
    return user
   }
   


   //geting username from database
   async function getUserName(email){
       const users = await getUser(email)
       //returning a username
       return users
   }
   
   // geting user details 
   Router.post("/signup",async function (request,response){
      const {username,password,email} = request.body
   
    
     
      // getting username from database to check it already exit
      const userFromDB = await getUserName(username)
   
      //validating if username is already exit
      if(userFromDB){
       response.status(400).send("username alreay exists")
      }
      //validating is password is not lesser then 8 character
      else if(password.length < 8){
       response.status(400).send("password must be 8 characters")
      }
      
      else{
       // getting send and geting hash password
       const hashedPassword=await genHashedPassword(password)
       
       //creating a user by name and hash password
       const result = await createUser({
           username:username,
           password:hashedPassword,
           email:email
       })
       response.send(result)
      }
   })
   

   
   Router.post("/login",async function (request,response){
       const {username,password}=request.body
       
   
       // getting username from database to check it already exit
       const userFromDB = await getUserName(username)
   
       if(! userFromDB){
           response.status(401).send("Invalid credentials")
       }
       else{
           const storedDBPassword = userFromDB.password
   
           const isPasswordMatch= await bcrypt.compare(password,storedDBPassword)
   
           if(isPasswordMatch){
               const token = jwt.sign({id:userFromDB._id},process.env.SECRET_KEY)
   
               const storeTokenInDB = await tokens(userFromDB, token)
               response.send({message : "successful login",
           token:token})
   
   
           }
           else{
               response.status(401).send("Invalid credentials")
           }
   
   
       }
   })
   
   Router.get("/token/:email",async function(request,response){

    const {email} = request.params
            
    const getToken = await getTokens(email);
    
   
    response.send(getToken)
})

Router.delete('/logout/:username',auth,async function(request,response){
    const {username} = request.params
    
    const token = await deleteToken(username);
        
          response.send("done")
    
        
        })

export default Router

