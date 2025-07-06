import {StreamChat} from "stream-chat"
import dotenv from "dotenv"

dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

console.log("DEBUG: STREAM_API_KEY:", apiKey ? "LOADED" : "NOT FOUND!");
console.log("DEBUG: STREAM_API_SECRET:", apiSecret ? "LOADED" : "NOT FOUND!");

if(!apiKey || !apiSecret){
    console.error("Stream API key or secret is missing. Check your .env file and variable names (e.g., STREAM_API_KEY, STREAM_API_SECRET).");
    // No need to throw here now, as we know they are loaded
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Verify Stream client is properly initialized
console.log("DEBUG: Stream client initialized with API key:", apiKey ? "PRESENT" : "MISSING");

export const upsertStreamUser = async (userData)=>{
    try {
        // *** ADD THIS DEBUG LOG ***
        console.log("DEBUG: Data being sent to Stream upsertUser:", JSON.stringify(userData, null, 2));

        // Stream Chat expects user data to be passed as an object with specific properties
        // The userData should contain: id, name, image (optional)
        const streamUser = {
            id: userData.id,
            name: userData.name,
            image: userData.image || ""
        };

        console.log("DEBUG: About to call streamClient.upsertUsers with:", JSON.stringify([streamUser], null, 2));

        // Use upsertUsers (plural) and pass the user as an array
        const result = await streamClient.upsertUsers([streamUser]);
        console.log("DEBUG: Stream API response:", JSON.stringify(result, null, 2));
        console.log("Stream user created successfully:", streamUser.id);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        console.error("Error details:", error.message);
        if (error.response) {
            console.error("Error response:", error.response.data);
        }
        throw new Error("Failed to upsert Stream user");
    }
}

export const generateStreamToken = (userId) => {
    try {
        if (!apiKey || !apiSecret) {
        throw new Error("Stream API key or secret is not set");
    }
    const userIdStr = userId.toString();
    console.log("DEBUG: Generating Stream token for user ID:", userIdStr);
    return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
    }
}

   