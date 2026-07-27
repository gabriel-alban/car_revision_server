import { Router } from "express";
import authController from "../controllers/authController.js";
import { validate } from "../middleware/validateSchemas.js";
import { registerSchema } from "../validations/authValidation.js";

const router = Router();

router.get('/me', authController.me);
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authController.login);

export default router;