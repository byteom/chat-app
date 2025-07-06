import mongoose from "mongoose"
import dotenv from "dotenv" 

dotenv.config();

export const connectDb = async ()=>{
    try{
      const conn=   await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDb connected : ${conn.connection.host}`)
    }catch(err){
        console.log(`Error in database ${err}`)
        process.exit(1) // failure code is 1
    }
}