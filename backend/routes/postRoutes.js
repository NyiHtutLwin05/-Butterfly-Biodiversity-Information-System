import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all posts (public)
router.get("/", getAllPosts);

// Search posts
router.get("/search", searchPosts);

// Protected routes
router.post("/", authenticateToken, createPost);
router.get("/my-posts", authenticateToken, getUserPosts);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
