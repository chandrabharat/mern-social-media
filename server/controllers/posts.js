import Post from "../models/Post.js";
import User from "../models/User.js";


/* CREATE Controller actions */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();

        // Grabs all the posts. We need to return all the posts to the front end
        // The front end has a list of the updated posts so the news feed is up to date
        const post = await Post.find();

        res.status(201).json(post);
    } catch (err) {
        // The request could not be processed because of conflict in the request
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        // Grabs all the posts. 
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        // The website you were trying to reach couldn't be found on the server.
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async(req, res) => {
    try {
        const { userId } = req.params;
        // Get all posts with this userId
        const post = await Post.find({ userId }); 
        res.status(200).json(post);
    } catch (err) {
        // The website you were trying to reach couldn't be found on the server.
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async(req, res) => {
    try {
        // The post id is a part of the route query string
        const { id } = req.params;
        // UserId is a part of the request body from the post request
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        // If the post has been not been liked by userId then like it and vice versa
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        // Need to update the DB entry of this post with the new likes
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        // The website you were trying to reach couldn't be found on the server.
        res.status(404).json({ message: err.message });
    }
}; 