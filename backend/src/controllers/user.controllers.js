import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res) { // Function to get recommended users for the current user
    // This function fetches users who are not the current user and are not friends with the current user
    // It also ensures that only users who are onboarded are included in the recommendations
    // The current user's ID is obtained from the request object, which is assumed to be populated
    try {
        const currentUserId = req.user.id; // Get the current user's ID from the request
        const currentUser = req.user // Get the current user object from the request

        const recommendedUsers = await User.find({  //
            $and :[  // find users who are not the current user 
                {_id:{$ne:currentUserId}},    // exclude current user id 
                {friends:{$nin:currentUser.friends}}, // exclude friends of current user
                {isOnBoarded: true} // only include users who are onboarded
            ]
        })

        res.status(200).json(
           recommendedUsers // Return the recommended users
        );
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Function to get the current user's friends
export async function getMyFriends(req,res) {
    try {
        const user = await User.findById(req.user.id) // Get the current user
            .select("friends") // Select only the friends field
            .populate("friends", "fullname profilePic nativeLanguage learningLanguage") // Populate the friends field with specific fields
        res.status(200).json(// Return the friends of the current user
             user.friends 
        );


    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function sendFriendRequest(req,res) {
   try {
    const myId = req.User.id; // my id
    const {id:recipientId} = req.params // recipent id


    // prevent sending req to yourself
    if(myId === recipientId) {
        return res.status(400).json({message:"You cannot send friend request to yourself"});
    }

    const recipient = await User.findById(recipientId) // find the recipient
    if(!recipient) {
        return res.status(404).json({message:"User not found"}); // if recipient not found
    }
    // check if the recipient is already a friend
    if(recipient.friends.includes(myId)) {
        return res.status(400).json({message:"You are already friends with this user"}); // if already friends
    }
    // check if the recipient has already sent a friend request
    if(recipient.friendRequests.includes(myId)) {
        return res.status(400).json({message:"You have already sent a friend request to this user"}); // if already sent a friend request
    }
    // check if the recipient has already received a friend request
    const existingRequest = await FriendRequest.findOne({
         $or: [
            { sender: myId, recipient: recipientId }, // check if the current user has sent a request to the recipient
            { sender: recipientId, recipient: myId } // check if the recipient has sent a request to the current user
        ]   
    });

    if(existingRequest) {
        return res.status(400).json({message:"Friend request already exists"}); // if already exists
    }
    // create a new friend request
    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    });
    res.status(201).json( // return the friend request
        friendRequest   
    );
   } catch (error) {
       console.error("Error sending friend request:", error);
       res.status(500).json({ message: "Internal server error" });
   }
}


export async function acceptFriendRequest(req, res) {
    try {
        const {id:requestId}=req.params
        const friendRequest = await FriendRequest.findById(requestId) // Find the friend request by ID
        if(!friendRequest) {
            return res.status(404).json({message:"Friend request not found"}); // If the friend request does not exist
        }

        // Verify the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({message:"You are not authorized to accept this friend request"}); // If the current user is not the recipient
        }

        if(friendRequest.status === "accepted") {
            return res.status(400).json({message:"Friend request already accepted"}); // If the friend request is already accepted
        }

        // Update the friend request status to accepted
        friendRequest.status = "accepted";
        await friendRequest.save(); // Save the updated friend request


        //add each user to the other's friends array
        // This is done by finding both the sender and recipient of the friend request
        // $addToSet is used to ensure that the user is added only if they are not already in the friends array
        await User.findByIdAndUpdate(
            friendRequest.sender, // Find the sender of the friend request
            { $addToSet: { friends: friendRequest.recipient } }, // Add the recipient to the sender's friends array
            { new: true } // Return the updated user
        );
        await User.findByIdAndUpdate(
            friendRequest.recipient, // Find the recipient of the friend request
            { $addToSet: { friends: friendRequest.sender } }, // Add the sender to the recipient's friends array
            { new: true } // Return the updated user
        );
        res.status(200).json({message:"Friend request accepted"});

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getFriendRequest(req, res) {
    try {
        const incommingRequests = await FriendRequest.find({
            recipient: req.user.id, // Find friend requests where the current user is the recipient
            status: "pending" // Only include pending requests
        }).populate("sender", "fullname profilePic nativeLanguage learningLanguage"); // Populate sender details

        const acceptedRequests = await FriendRequest.find({
            recipient: req.user.id, // Find friend requests where the current user is the recipient
            status: "accepted" // Only include accepted requests
        }).populate("sender", "fullname profilePic "); // Populate sender details

        res.status(200).json({
            incommingRequests, // Return incoming friend requests
            acceptedRequests // Return accepted friend requests
        });

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id, // Find friend requests where the current user is the sender
            status: "pending" // Only include pending requests
        }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage"); // Populate recipient details

        res.status(200).json(outgoingRequests); // Return outgoing friend requests

    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}