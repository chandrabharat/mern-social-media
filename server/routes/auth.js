import express from "express";
import { login } from "../controllers/auth.js";

// Allows us to do router.post instead of app.use
const router = express.Router();

router.post("/login", login);

export default router;