import { Router } from "express";
import CarController from "../controllers/carsController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createCarSchema, carIdParamSchema } from "../validations/carValidation.js";

const router = Router();

router.get('/', CarController.getAllCars)
router.post('/', validate(createCarSchema) ,CarController.storeCar);
router.get('/:id', validate(carIdParamSchema) ,CarController.getCar);
router.delete('/:id', validate(carIdParamSchema), CarController.updateCarInformation);
router.put('/:id',validate(carIdParamSchema), CarController.deleteCarInformation);

export default router;