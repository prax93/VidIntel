import { CronJob } from 'cron';
import mediastat from './mediastat.js';

export default {
    generateJSON: cronStart
}

function cronStart(boolean, cronSchedule) {
    const cronjob = new CronJob(
        cronSchedule, // cronTime
        async function () {
            try {
                console.info(`${new Date().toISOString()} CronJob Started`);
                await mediastat.readMediaInfos('/movies');
                console.info(`${new Date().toISOString()} Cronjob Finished sucessfully`);
            } 
            catch (err) {
                console.error(`${new Date().toISOString()} Cronjob Halted: ${err.message}`);
                throw new Error(err)
            }
        },
        boolean, // Start
        'system' // timeZone
    )
}