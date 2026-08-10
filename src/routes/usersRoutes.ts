import { Router } from "express";
import usersController from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/', authMiddleware, usersController.getUsers);

export default router;