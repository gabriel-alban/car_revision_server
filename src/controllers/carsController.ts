import { Car } from "../models/carModel.js";
import { Request, Response } from "express";

class CarController {
    private getUserId(req: Request, res: Response): string | undefined {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized!' });
            return undefined;
        }

        return userId;
    }

    async getAllCars(req: Request, res: Response) {
        const userId = this.getUserId(req, res);
        if (!userId) return;
        try {
            const cars = await Car.find({ user: userId });

            return res.status(200).json({ items: cars });
        } catch (err) {
            return res.status(500).json({ message: 'Something went wrong!' })
        }
    }

    async storeCar(req: Request, res: Response) {
        const userId = this.getUserId(req, res);
        if (!userId) return;

        try {
            const car = new Car({ ...req.body, user: userId });
            await car.save();

            return res.status(201).json({ car });
        } catch (err) {
            return res.status(500).json({ message: 'Something went wrong!' })
        }
    }

    async getCar(req: Request, res: Response) {
        const userId = this.getUserId(req, res);
        if (!userId) return;

        const { id } = req.params;

        try {
            const car = await Car.findOne({ _id: id, user: userId });
            if (!car) return res.status(404).json({ message: 'Car not found.' });

            return res.status(200).json({ car });
        } catch (err) {
            return res.status(500).json({ message: err instanceof Error ? err.message : 'Something went wrong!' })
        }
    }

    async updateCarInformation(req: Request, res: Response) {
        const userId = this.getUserId(req, res);
        if(!userId) return;

        const { id } = req.params;
        const { brand, model, km_range } = req.body;

        try {
            const car = await Car.findOneAndUpdate(
                {_id: id, user: userId},
                { $set: { brand, model, km_range } },
                { new: true, runValidators: true }
            );

            if (!car) {
                return res.status(404).json({ message: "Car not found!" });
            }

            return res.status(200).json({ car })
        } catch {
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    async deleteCarInformation(req: Request, res: Response) {
        const userId = this.getUserId(req, res);
        if(!userId) return;

        const { id } = req.params;

        try {
            const car = await Car.findOneAndDelete({_id: id, user: userId});
            if(!car) return res.status(404).json({error: 'Car not found!'});

            return res.status(200).json({message: 'Car erased'});
        } catch (err) {
            return res.status(500).json("Something went wrong!")
        }
    }
}

export default new CarController();