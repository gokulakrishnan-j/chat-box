import express from "express"
import { generator,auth} from "../index.js"

var Router = express.Router()
Router.get('/',auth,async function(request,response){
  
    var roomId = generator.generate({
      length: 4,
      numbers: true
    });
  
    response.send({roomId:roomId})
    
  
  })

  export default Router