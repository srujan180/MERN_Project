import rateLimit from "./upstash.js";


    const rateLimiter = async(req,res,next) =>{
    try {
        const {success} = await rateLimit.limit("my-rate-limit")
        if(!success) return res.status(429).json({message:"too many requests try again after some time"})
   next()
        } catch (error) {
        console.log("rate limit error")
        next(error);
    }}



export default rateLimiter;