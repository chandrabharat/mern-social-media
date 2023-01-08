import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ routes */

// Get all posts in the database
router.get("/", verifyToken, getFeedPosts);

// Get all posts made by user with id userId
router.get("/:userId/posts", verifyToken, getUserPosts);


/* UPDATE routes */

// Liking and unliking a post
router.patch("/:id/like", verifyToken, likePost);

export default router;