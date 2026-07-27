import { Router } from "express";
import CarController from "../controllers/carsController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createCarSchema, carIdParamSchema, updateCarSchema } from "../validations/carValidation.js";

const router = Router();

router.get('/', CarController.getAllCars)
router.post('/', validate(createCarSchema), CarController.storeCar);
router.get('/:id', validate(carIdParamSchema), CarController.getCar);
router.delete('/:id', validate(carIdParamSchema), CarController.deleteCarInformation);
router.put('/:id',validate(updateCarSchema), CarController.updateCarInformation);

export default router;