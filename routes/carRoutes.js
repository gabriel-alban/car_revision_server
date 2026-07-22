import { Router } from "express";
import { Car } from "../models/carModel.js";
import { CarController } from "../controllers/carsController.js";

const router = Router();

router.get('/', CarController.getAllCars)
router.post('/', CarController.storeCar);
router.get('/:id', async (req, res) => {});
router.delete('/:id', async (req, res) => {});
router.put('/:id', async (req, res) => {});

export default router;