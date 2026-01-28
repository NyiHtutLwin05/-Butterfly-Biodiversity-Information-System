import Post from "../models/Post.js";
import multer from "multer";
import path from "path";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1.2 * 1024 * 1024 }, // 1.2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .png and .jpg files are allowed"));
    }
  },
}).single("image");

export const createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { username } = req.user;
      const {
        geographicDistribution,
        time,
        date,
        butterflySpecies,
        primaryActivity,
        duration,
        comments,
      } = req.body;

      const imageUrl = req.file ? req.file.path : null;

      const post = new Post({
        username,
        geographicDistribution,
        time,
        date,
        butterflySpecies,
        primaryActivity,
        duration: parseInt(duration),
        comments,
        imageUrl,
      });

      await post.save();
      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.user;
    const posts = await Post.find({ username }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    const posts = await Post.find({
      $or: [
        { butterflySpecies: { $regex: q, $options: "i" } },
        { geographicDistribution: { $regex: q, $options: "i" } },
        { comments: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.username !== username) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this post" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const {
          geographicDistribution,
          time,
          date,
          butterflySpecies,
          primaryActivity,
          duration,
          comments,
        } = req.body;

        // Update post fields
        post.geographicDistribution = geographicDistribution;
        post.time = time;
        post.date = date;
        post.butterflySpecies = butterflySpecies;
        post.primaryActivity = primaryActivity;
        post.duration = parseInt(duration);
        post.comments = comments;

        if (req.file) {
          post.imageUrl = req.file.path;
        }

        await post.save();
        res.json({ message: "Post updated successfully", post });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.username !== username) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
