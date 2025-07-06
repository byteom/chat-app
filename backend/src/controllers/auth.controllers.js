import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";


// This function handles user signup by validating the input, creating a new user in the database, and generating a JWT token
// It is called when a new user registers for the application
export async function signup(req, res) {
    // Handle user signup logic here
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            // checking if all fields are provided
            return res.status(400).json({
                message: "All field is requires",
            });
        }

        if (password.length < 6) {
            // checking if password is at least 6 characters long
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for validating email format
        if (!emailRegex.test(email)) {
            // If the email does not match the regex pattern
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        //if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    message: "Email already exist . please login or use diffrent one",
                });
        }

        const idx = Math.floor(Math.random() * 100) + 1; // Generate a random index for the profile picture
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; // Generate a random avatar URL

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        console.log(newUser._id)
         //Upsert the user in Stream with the new user's data
            // This function is defined in the stream.js file and is used to create or update a user in Stream
            // It takes the user data as an argument and returns the user data after successful upsert
        try {
           
            await upsertStreamUser({
                id: newUser._id.toString(), 
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
        } catch (error) {
            console.error("Error upserting Stream user:", error);
            return res.status(500).json({
                message: "Failed to upsert Stream user",
            });
        }

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        ); // Create a JWT token for the new user

        res.cookie("token", token, {
            // Set the token in a cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
            httpOnly: true, // Cookie is only accessible via HTTP requests, not JavaScript [helps prevent XSS attacks]
            secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS connections
            sameSite: "Strict",
        });

        // User is already saved by User.create(), no need to save again
        res.status(201).json({
            // Respond with a success message and the new user's data
            message: "User created successfully",
        });
    } catch (error) {
        // Catch any errors that occur during signup
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}


// This function handles user login by verifying the provided credentials and generating a JWT token
// It is called when the user attempts to log in to the application
export async function login(req, res) {
    // Handle user login logic here

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "please enter email and password" });
        }

        const user = await User.findOne({ email }); // Find the user by email in the database
        // If the user does not exist, return an error response
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password); // Check if the provided password matches the stored hashed password
        // The matchPassword method is defined in the User model and uses bcrypt to compare the passwords
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        }); // Create a JWT token for the user
        res.cookie("token", token, {
            // Set the token in a cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
            httpOnly: true, // Cookie is only accessible via HTTP requests, not JavaScript [helps prevent XSS attacks]
            secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS connections
            sameSite: "Strict",
        });
        res.status(200).json({
            // Respond with a success message and the user's data
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

// This function handles user logout by clearing the authentication token cookie
// It is called when the user wants to log out of the application
export async function logout(req, res) {
    // Handle user logout logic here
    res.clearCookie("token", {
        // Clear the token cookie to log out the user
        httpOnly: true, // Cookie is only accessible via HTTP requests, not JavaScript
        secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS connections
        sameSite: "Strict",
    });
    res.status(200).json({
        // Respond with a success message
        message: "User logged out successfully",
    });
}

// This function handles user onboarding, which is the process of collecting additional information from the user after they have signed up.
// It updates the user's profile with the provided information and marks them as onboarded in the database
export async function onboard(req,res) {
   try {
    console.log("DEBUG: Onboarding request body:", JSON.stringify(req.body, null, 2));
    console.log("DEBUG: User ID from token:", req.user._id);
    
    const userId = req.user._id

    const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body
    
    console.log("DEBUG: Extracted fields:", {
        fullName: !!fullName,
        bio: !!bio,
        nativeLanguage: !!nativeLanguage,
        learningLanguage: !!learningLanguage,
        location: !!location
    });
    
    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
        console.log("DEBUG: Missing fields:", {
            fullName: !fullName,
            bio: !bio,
            nativeLanguage: !nativeLanguage,
            learningLanguage: !learningLanguage,
            location: !location
        });
        return res.status(400).json({message:"All fields are required"})
    }   

    const updatedUser = await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarding:true,

    },{new:true})

    if(!updatedUser){
        return res.status(404).json({message:"User not Found"})
    }

    // Update the user in Stream Chat with new information
    try {
        await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        });
        console.log("Stream user updated successfully during onboarding:", updatedUser._id);
    } catch (error) {
        console.error("Error updating Stream user during onboarding:", error);
        // Don't fail the onboarding if Stream update fails 
    }

    res.status(200).json({success:true, user:updatedUser});
   } catch (error) {
    console.error("Onboarding error:",error);
    res.status(500).json({message:"Internal Server Error "});
   }
}