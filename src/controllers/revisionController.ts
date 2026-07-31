import { Request, Response } from 'express';
import { Revision } from '../models/revisionModel.js';
import { Car } from '../models/carModel.js';

class RevisionController {
    async getRevisions(req: Request, res: Response): Promise<Response> {
        const { carId } = req.params;

        if (!carId) return res.status(400).json({error: 'No car was selected'});
        
        try {
            const revisions = await Revision.find({car: carId}).sort({date: 1});
            return res.status(200).json(revisions);
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong!'});
        }
    }

    async storeRevision(req: Request, res: Response): Promise<Response> {
        const { carId } = req.params;

        if (!carId) return res.status(400).json({error: "No car selected."});

        try {
            const revision = new Revision({...req.body, car: carId});
            await revision.save();
            
            await Car.updateOne(
                {_id: carId},
                {$max: { km_range: revision.current_km_number}}
            )

            return res.status(201).json({revision, message: 'Success!'});
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong!'})
        }
    }

    async deleteRevision(req: Request, res: Response): Promise<Response> {
        const {carId, id} = req.params;

        if (!carId) return res.status(400).json({error: "No car selected."});
        if (!id) return res.status(400).json({error: 'No revision selected.'});

        try {
            await Revision.findOneAndDelete({_id: id, car: carId});
            return res.status(200).json({message: 'Success'});
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong!'});
        }
    }
}

export default new RevisionController();