import { Router } from "express";
import CarController from "../controllers/carsController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createCarSchema, carIdParamSchema, updateCarSchema } from "../validations/carValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/', authMiddleware, CarController.getAllCars)
router.post('/', authMiddleware, validate(createCarSchema), CarController.storeCar);
router.get('/:id', authMiddleware, validate(carIdParamSchema), CarController.getCar);
router.delete('/:id', authMiddleware, validate(carIdParamSchema), CarController.deleteCarInformation);
router.put('/:id', authMiddleware, validate(updateCarSchema), CarController.updateCarInformation);

export default router;