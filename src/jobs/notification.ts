import cron from 'node-cron';

import { Revision } from '../models/revisionModel.js';
import { Car } from '../models/carModel.js';
import { sendWelcomeEmail } from '../helpers/mailer.js';
import path from 'node:path';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const runDailyRevisionCheck = async () => {
    const revisions = await Revision.find({}).populate({path: "car", populate: {path: "user", select: "_id username email"}});
    console.log(revisions);
}

export const startDailyRevisionCron = () => {
    cron.schedule(
        "* * * * *",
        async () => {
            try {
                await runDailyRevisionCheck();
            } catch(err) {
                console.error("Daily revision cron failed", err)
            }
        },
        {timezone: "Europe/Bucharest"}
    );
}