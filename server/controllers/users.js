import User from "../models/User.js";

/* READ Controller Action*/
export const getUser = async(req, res) => {
    try {
        // Use req.params to access route parameters (in the path of the request URL) and 
        // req.body to access the request body (the data sent in a POST request)
        const { id } = req.params;

        // findById is a mongoose function 
        const user = await User.findById(id);

        if (!user) return res.status(400).json({ msg: "User does not exist. "});
        
        res.status(200).json(user);
    } catch (err) {
        // The server cannot find the requested resource
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

/* UPDATE */
export const addRemoveFriend = async(req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // If the "friend" is in the friends list of the user then we want to remove the "friend"
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // If the "friend" is not in the friends list of the user then we want to add the "friend"
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        // Save updated objects
        await user.save();
        await friend.save();

        // Need to format the friends list before sending it to front end

        // Get all User objects that correspond to that friend id
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // From the friend user objects only store the id, name, occ, loc, picture
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
              return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};