import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO IS SUCCESSFULLY CONNECTED");
    } catch (error) {
        console.error("Error in connecting in mongodb", error)
        process.exit(1)
    }
    
};

// Export the connection to use it in other files
// export default mongoose.connection;
// connecting mongo 