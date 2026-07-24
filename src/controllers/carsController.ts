import { Car } from "../models/carModel.js";
import { Request, Response } from "express";

class CarController {
    async getAllCars(_req: Request, res: Response) {
        try {
            const cars = await Car.find({});

            return res.status(200).json({items: cars});
        } catch(err) {
            return res.status(500).json({message:'Something went wrong!'})
        }
    }

    async storeCar(req: Request, res: Response) {
        try {
            const car = new Car(req.body);
            await car.save();

            return res.status(201).json({car});
        } catch (err) {
            return res.status(500).json({message: 'Something went wrong!'})
        }
    }

    async getCar(req: Request, res: Response) {
        const {id} = req.params;
        try {
            const car = await Car.findById(id);
            if (!car) return res.status(404).json({message: 'Car not found.'});

            return res.status(200).json({car});
        } catch(err) {
            return res.status(500).json({message: err instanceof Error ? err.message : 'Something went wrong!'})
        }
    }

    async updateCarInformation(req: Request, res: Response) {
        const {id} = req.params;
        const {brand, model, km_range} = req.body;

        try {
            const car = await Car.findByIdAndUpdate(id, {
                $set: {
                    brand, model, km_range
                }
            });

            return res.status(201).json({car})
        } catch {
            res.status(500).json({message: 'Something went wrong'});
        }
    }

    async deleteCarInformation(req: Request, res: Response) {
        const {id} = req.params;

        try {
            const car = await Car.findByIdAndDelete(id);
            return res.status(204);
        } catch(err) {
            return res.status(500).json("Something went wrong!")
        }
    }
}

export default new CarController();