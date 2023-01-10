import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */

// Declares a constant called __filename and assigns it the file path of the current module.
const __filename = fileURLToPath(import.meta.url);
// Declares a constant called __dirname and assigns it the directory path of the current module.
const __dirname = path.dirname(__filename);
// Loads environment variables from a .env file in the root directory.
dotenv.config();
// Declares a constant called app and assigns it an instance of an Express application.
const app = express();
// Adds a middleware function that parses incoming requests with JSON payloads.
// When a request is made to your server, the express.json() middleware function will 
// look at the request body and try to parse it as JSON. If it is successful, it will add 
// a property called body to the request object, which you can then use to access the parsed request body.
app.use(express.json());
//The helmet package is a collection of middleware functions that help set various HTTP headers to secure an Express application. 
// These headers can help protect against common web vulnerabilities by setting strict policies for web browsers to follow.
app.use(helmet());
// The Cross-Origin-Resource-Policy HTTP header controls which domains are allowed to make requests to the server. 
// It is used to protect against cross-site request forgery (CSRF) attacks, which involve an attacker tricking a user's 
// browser into making a request to a server on behalf of the attacker.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Adds a middleware function that logs HTTP requests to the console.
app.use(morgan("common"));
// Adds a middleware function that parses incoming requests with JSON payloads and has a maximum request body size of 30MB.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
// Adds a middleware function that parses incoming requests with URL-encoded payloads and has a maximum request body size of 30MB.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// Adds a middleware function that allows the server to accept cross-origin requests from any domain.
app.use(cors());
// Adds a middleware function that serves static assets from the "public/assets" directory.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */

// The multer.diskStorage() function creates a storage object that 
// specifies where to store uploaded files, and how to name the files. 
// The destination function determines where to store the uploaded files,
// and the filename function determines how to name the stored files.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// The multer() function creates an instance of the multer middleware with the specified storage options
const upload = multer({storage});

/* ROUTES WITH FILES (need upload variable which is why it is not included in authRoutes)*/

// We hit '/auth/register' route and then we upload the picture locally defined by multer.diskstorage.destination
// as middleware function Then register controller function is called
app.post("/auth/register", upload.single("picture"), register);

// upload.single("picture") -> When the front end sends the picture image this line will grab the picture property
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES WITHOUT FILES*/

// The app.use function sets up middleware in the Express application.
// In this case, it mounts the middleware functions defined in the authRoutes
// object at the path /auth

// All routes in authRoutes will be prefixed by /auth
app.use("/auth", authRoutes);
// All routes in userRoutes will be prefixed by /users
app.use("/users", userRoutes);
// All routes in postRoutes will be prefixed by /posts
app.use("/posts", postRoutes)


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

// The mongoose.connect() function returns a promise that 
// is fulfilled when the connection to the MongoDB database
// has been established, or rejected if the connection fails.
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // An HTTP server is started using the Express app and listens for incoming requests on the port 
  // specified by the PORT constant.
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));