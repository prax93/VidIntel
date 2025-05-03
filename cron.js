import { CronJob } from 'cron';
import mediastat from './mediastat.js';

export default {
    cron: cronStart
}

function cronStart(boolean, cronSchedule) {
    const cronjob = new CronJob(
        cronSchedule, // cronTime
        async function () {
            try {
                const logDate = new Date().toISOString();
                await mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
                console.info(`${logDate} Sync Finished sucessfully`);
                cronjob.stop()
            } 
            catch (err) {
                throw new Error(err)
            }
        }, // onTick
        function() {
            const logDate = new Date().toISOString();
            console.log(`${logDate} Cronjob finished`);
        },
        boolean, // Start
        'Europe/Zurich' // timeZone
    )
}