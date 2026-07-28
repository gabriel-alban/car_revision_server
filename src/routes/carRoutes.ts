import { Router } from "express";
import CarController from "../controllers/carsController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createCarSchema, carIdParamSchema, updateCarSchema } from "../validations/carValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/', authMiddleware, CarController.getAllCars.bind(CarController))
router.post('/', authMiddleware, validate(createCarSchema), CarController.storeCar.bind(CarController));
router.get('/:id', authMiddleware, validate(carIdParamSchema), CarController.getCar.bind(CarController));
router.delete('/:id', authMiddleware, validate(carIdParamSchema), CarController.deleteCarInformation.bind(CarController));
router.put('/:id', authMiddleware, validate(updateCarSchema), CarController.updateCarInformation.bind(CarController));

export default router;