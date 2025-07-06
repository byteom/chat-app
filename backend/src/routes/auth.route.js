import { Router } from "express";
import { login } from "../controllers/auth.controllers.js";
import { logout } from "../controllers/auth.controllers.js";
import { onboard } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signup } from "../controllers/auth.controllers.js";

const router = Router();

router.post('/login', login);
router.post('/logout', logout);

// Route for user signup
router.post('/signup', signup);
router.post("/onboarding", protectRoute, onboard); // Route for user onboarding, protected by authentication middleware that checks for a valid JWT token

router.get("/me",protectRoute,(req,res)=>{ // checks if the user is authenticated and returns the user's information
    return res.status(200).json({
        succes:true,
        user:req.user
    })
})

export default router;
