import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers , getMyFriends , sendFriendRequest,getOutgoingFriendReqs ,acceptFriendRequest,getFriendRequest} from "../controllers/user.controllers.js";

const router= Router();


router.use(protectRoute); // apply auth middleware to all routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id" ,sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-request/", getFriendRequest);
router.get("/outgoing-friend-request", getOutgoingFriendReqs); // get outgoing friend requests


export default router;