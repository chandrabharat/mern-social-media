import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async(req, res) => {
    try {
        // the function first destructures the following variables from the req.body 
        // object: firstName, lastName, email, password, picturePath, friends, location, 
        // and occupation.
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Used to encrypt the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // The function then creates a new User object with the destructured variables, 
        // along with the encrypted password, and assigns it to a variable called newUser
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        // save() method to save the newUser object to the database 
        const savedUser = await newUser.save();
        // When you use the fetch function, the call to the API is made asynchronously,
        // and the rest of the code will continue to execute while the request is being made. 
        // The await keyword is used to pause the execution of the async function until a promise 
        // is resolved (a value is returned)

        //  HTTP 201 Created success status response code indicates 
        // that the request has succeeded and has led to the creation 
        // of a resource.

        // The user object is converted to a json object to be used by the front-end
        res.status(201).json(savedUser);
    } catch (err) {
        // Server side error with either saving, generating salt, or hashing
        res.status(500).json({error : err.message});
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Use mongoose to find user metaData for this specified email 
        const user = await User.findOne({ email: email });
        // Malformed request so error status is 400 and the message with the error is that user does not exist
        if (!user) return res.status(400).json({ msg: "User does not exist. "});

        // Will use the same salt during registration to compare if the inputted password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

        // Generate a json webtoken with user_id made by mongodb and a secret defined in .env
        // The process object is a global object in Node.js that provides information about the
        // current Node.js process.
        const token = jwt.sign({ id : user._id }, process.env.JWT_SECRET);

        // Does not delete the password from the DB it simply deletes it from the user returned object so it 
        // is not send to the front end with the status code
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        // Server side error with either findOne, isMatch
        res.status(500).json({error : err.message});
    }
}