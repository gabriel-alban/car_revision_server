import { Router } from "express";
import CarController from "../controllers/carsController.js";

const router = Router();

router.get('/', CarController.getAllCars)
router.post('/', CarController.storeCar);
router.get('/:id', CarController.getCar);
router.delete('/:id', CarController.updateCarInformation);
router.put('/:id', CarController.deleteCarInformation);

export default router;