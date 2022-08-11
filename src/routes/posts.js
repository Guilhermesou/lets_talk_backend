import { Router } from "express";
import posts_controller from "../controllers/posts-controller.js";
import authMiddleware from "../middleware/auth.js";
const router = Router();

router.post('/', [authMiddleware, posts_controller.create]);
router.put('/:id', [authMiddleware, posts_controller.update]);
router.delete('/:id', [authMiddleware, posts_controller.remove]);
router.put('/:id/like', [authMiddleware, posts_controller.like]);
router.get('/:id', [authMiddleware, posts_controller.getOne]);
router.get('/profile/:username', [authMiddleware, posts_controller.getProfile]);
router.get('/timeline/:userId', [authMiddleware, posts_controller.getTimeline]);

export default router;