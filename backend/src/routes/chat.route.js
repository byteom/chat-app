import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controllers.js";


const router = Router()

router.get("/token",protectRoute,getStreamToken) // Get the stream token for the current user

export default router