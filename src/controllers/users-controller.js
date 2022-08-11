import bcrypt from "bcrypt";
import User from "../models/User.js";

async function getUserById (id) {
    try {
        const user = await User.findById(userId);
        return user;
        
    } catch (error) {
        return error
    }
}

async function remove (req, res) {
    try {
            if (req.body.userId === req.params.id || req.body.isAdmin) {
                try {
                    await User.findByIdAndDelete(req.params.id);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.status(200).send('Account has been deleted!');
                } catch (error) {
                    return res.status(400).send(error);
                }
            
            } else {
                res.status(403).send('You can update only your account!');
            }
        } catch (error) {
    
        }
    }

async function update (req, res) {
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (error) {
                    return res.status(500).send(error.message);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
                res.header("Access-Control-Allow-Origin", "*");
                res.status(200).send('Account has been updated!');
            } catch (error) {
                return res.status(400).send(error);
            }
        
        } else {
            res.status(403).send('You can update only your account!');
        }
    } catch (error) {

    }
}

async function getAll (req, res) {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId 
        ? await User.findById(req.params.id)
        : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send(other);
        
    } catch (error) {
        res.status(500).send('error');
    }
}


async function follow (req, res) {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: { followers: req.body.userId}});
                await currentUser.updateOne({$push: { followings: req.params.id}});
                res.header("Access-Control-Allow-Origin", "*");
                res.status(200).send("User has been followed");
            } else {
                return res.status(403).send('You allready follow this user');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).send("You can't follow yourself");
    }
}


async function unfollow (req, res) {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: { followings: req.params.id}});
                res.header("Access-Control-Allow-Origin", "*");
                res.status(200).send("User has been followed");
            } else {
                return res.status(403).send("You don't follow this user");
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).send("You can't follow yourself");
    }
}

export default { remove, update, follow, unfollow, getUserById }