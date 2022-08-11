import { Router} from "express";
import users_controller from "../controllers/users-controller.js";
import authMiddleware from "../middleware/auth.js";
const router = Router();

router.put('/:id', [authMiddleware, users_controller.update])
router.delete('/:id', [authMiddleware, users_controller.remove])
router.get('/', [authMiddleware, users_controller.getUserById])
router.put('/:id/follow', [authMiddleware, users_controller.follow])
router.put('/:id/unfollow', [authMiddleware, users_controller.unfollow]);

export default router;