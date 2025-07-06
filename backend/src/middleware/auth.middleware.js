import jwt from "jsonwebtoken"
import User from "../models/User.js"

//This complete middleware function is used to protect routes that require authentication
// It checks for a valid JWT token in the request cookies, verifies it, and retrieves the user information from the database.
// If the token is valid and the user exists, it allows the request to proceed; otherwise, it returns an unauthorized error response.
// If the user exists, compare the provided password with the stored password
// If the passwords match, generate a JWT token and send it in the response
 
export const protectRoute = async (req,res,next)=>{
    try {
        console.log("DEBUG: Cookies received:", req.cookies);
        const token = req.cookies.token;
        if(!token){
            console.log("DEBUG: No token found in cookies");
            return res.status(401).json({message:"Unauthorized --No token Provided"}) ;
        }
        console.log("DEBUG: Token found:", token.substring(0, 20) + "...");

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) // Verify the token using the secret key . this will decode the token and return the payload if valid or throw an error if invalid
        console.log("DEBUG: Token decoded successfully, userId:", decoded.userId);

        if(!decoded){
            console.log("DEBUG: Token verification failed");
            return res.status(401).json({message:"Unauthorized --Invalid token"}) ; // If the token is invalid, return an error response
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find the user by ID from the decoded token , don't select the password field to avoid sending it in the response
        if(!user){
            return res.status(401).json({message:"Unauthorized --User not found"}) ; // If the user is not found, return an error response
        }

        req.user = user; // Attach the user object to the request
        next(); // Call the next middleware
    } catch (error) {
        return res.status(401).json({message:"Unauthorized --Invalid token"}) ; 
    }
}