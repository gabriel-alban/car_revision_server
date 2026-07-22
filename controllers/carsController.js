import { Car } from "../models/carModel.js";

export const CarController = {
    async getAllCars(req, res) {
        try {
            const cars = await Car.find({});

            return res.status(200).json({items: cars});
        } catch(err) {
            return res.status(500).json("Something went wrong!")
        }
    },

    async storeCar(req, res) {
        try {
            const {brand, model, km_range} = req.body;
            const car = new Car(req.body);
            await car.save();

            return res.status(201).json({car});
        } catch (err) {
            return res.status(500).json({message: 'Something went wrong!'})
        }
    }
}