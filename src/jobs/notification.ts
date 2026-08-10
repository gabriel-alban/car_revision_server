import cron from 'node-cron';

import { Revision } from '../models/revisionModel.js';
import { transporter } from '../helpers/mailer.js';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const runDailyRevisionCheck = async () => {
    const revisions = await Revision.find({ car: { $exists: true, $ne: null } }).populate({ path: "car", populate: { path: "user", select: "_id username email" } }).lean();
    const carRevisions = revisions.filter((rev) => rev.car && (rev.car as any).user !== null);
   
    const now = Date.now();

    carRevisions.forEach(async (rev) => {
        const user = (rev.car as any).user;

        if (now > new Date(rev.date).getTime() + ONE_YEAR_MS && rev.revision_type === 'consumable') {
            await transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: user.email,
                subject: 'Revision overdue',
                text: `Hi ${user.username}, your revision ${rev.revision_title}, is overdue!`,
                html:`<p>Hi <b>${user.username}</b>, your revision "<b>${rev.revision_title}</b>" is overdue.</p>`
            });
        }
    })
}

export const startDailyRevisionCron = () => {
    cron.schedule(
        "0 10 * * *",
        async () => {
            try {
                await runDailyRevisionCheck();
            } catch (err) {
                console.error("Daily revision cron failed", err)
            }
        },
        { timezone: "Europe/Bucharest" }
    );
}