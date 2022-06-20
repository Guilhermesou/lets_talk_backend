import { Router } from "express";
import posts_controller from "../controllers/posts-controller.js";
import authMiddleware from "../middleware/auth.js";
const router = Router();

router.post('/', [authMiddleware, posts_controller.create]);
router.put('/:id', [authMiddleware, posts_controller.update]);
router.delete('/:id', posts_controller.remove);
router.put('/:id/like', posts_controller.like);
router.get('/:id', posts_controller.getOne);
router.get('/profile/:username', posts_controller.getProfile);
router.get('/timeline/:userId', posts_controller.getTimeline);
/*
router.get('/', (req, res) => {

});

router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).send(savedPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            res.status(200).send('Post has been updated!');
        } else {
            res.status(403).send('You can update only your post');
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).send('Post has been deleted!');
        } else {
            res.status(403).send('You can delete only your post');
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json('post Liked!');
        } else {
            await post.updateOne({$pull: { likes: req.body.userId}});
            res.status(200).send('Post disliked!');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id });

        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send(posts);
    } catch( error) {
        res.status(500).send(error.message);
    }
});

router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({
            userId: currentUser._id
        });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                Post.find({userId: friendId});
            })
        );
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send(userPosts.concat(...friendPosts));
    } catch( error) {
        res.status(500).send(error.message);
    }
});
*/
export default router;