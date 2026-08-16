import { Car } from "../models/carModel.js";
import { NextFunction, Request, Response } from "express";

class CarController {
    private getUserId(req: Request, res: Response): string | undefined {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized!' });
            return undefined;
        }

        return userId;
    }

    async getAllCars(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userId = this.getUserId(req, res);
        if (!userId) return res.status(400).json({error: 'No userId provided!'});
        try {
            const cars = await Car.find({ user: userId });

            return res.status(200).json({ items: cars });
        } catch (err) {
            next(err);
        }
    }

    async storeCar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userId = this.getUserId(req, res);
        if (!userId) return res.status(400).json({error: 'No userId provided!'});

        try {
            const car = new Car({ ...req.body, user: userId });
            await car.save();

            return res.status(201).json({ car });
        } catch (err) {
            next(err);
        }
    }

    async getCar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userId = this.getUserId(req, res);
        if (!userId) return res.status(400).json({error: 'No userId provided!'});

        const { id } = req.params;

        try {
            const car = await Car.findOne({ _id: id, user: userId });
            if (!car) return res.status(404).json({ message: 'Car not found.' });

            return res.status(200).json({ car });
        } catch (err) {
            next(err);
        }
    }

    async updateCarInformation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userId = this.getUserId(req, res);
        if(!userId) return res.status(400).json({error: 'No userId provided!'});

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
        } catch (err) {
            next(err);
        }
    }

    async deleteCarInformation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userId = this.getUserId(req, res);
        if(!userId) return res.status(400).json({error: 'No userId provided!'});

        const { id } = req.params;

        try {
            const car = await Car.findOneAndDelete({_id: id, user: userId});
            if(!car) return res.status(404).json({error: 'Car not found!'});

            return res.status(200).json({message: 'Car erased'});
        } catch (err) {
            next(err);
        }
    }
}

export default new CarController();