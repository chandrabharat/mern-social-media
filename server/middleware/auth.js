import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        // From the request object from the front end we are grabbing the authorization header
        // This is where the token will be sent once the user is logged in
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // The front end will set the token to have the bearer prefix
        if (token.startsWith("Bearer ")) {
            // Remove the bearer prefix to get just the token
            token = token.slice(7, token.length).trimLeft();
        }

        // The jwt.verify() function checks the validity of the token and decodes it, 
        // returning the decoded payload if the token is valid. This decoded payload 
        // is then added to the request object as a property called "user".
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        // the next() function is called to pass control to the next middleware function or
        // route handler in the chain
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}