import express from "express";
// imports the user functions from the users.js controller
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ Routes */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE Routes */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// exports the router object as the default export of the file. 
// In this case, other files that import this file will be able to 
// access the router object using the following syntax: import router from './routes/users.js';
// look at index.js imports to see where this is used
export default router;