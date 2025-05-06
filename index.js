import { createServer } from 'node:http';
import mediastat from './mediastat.js';
import jsonCreator from './jsonCreator.js';
import cron from './cron.js'

const SERVER_PORT = process.env.SERVER_PORT
const CRON_ENABLED = process.env.CRON_ENABLED
const CRON_SCHEDULE = process.env.CRON_SCHEDULE

const server = createServer(handler)

if(CRON_ENABLED === 'true'){
    cron.generateJSON(true, CRON_SCHEDULE !== undefined ? CRON_SCHEDULE.toString(): '0 0 * * 7')
}
async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const requestUrl = req.url;
    const current_url = new URL(req.url, `http://${req.headers.host}`);
    const search_params = current_url.searchParams;
    const search = search_params.get('search');
    res.setHeader('Content-Type', 'application/json');
    try {
        jsonCreator.reader('./movies.json', (err, data) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            throw new Error ({
                message: 'Failed to read movies.json' 
            })
        } 
        else {
            const movies = JSON.parse(data);
            const filteredMovies = search ? movies.filter((movie) => movie.name.toLowerCase().includes(search.toLowerCase())) : movies;
            res.statusCode = 200;
            res.end(JSON.stringify(filteredMovies));
        }
        });
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                message: err.message
            }))
        }

    if (requestUrl.includes('/refresh')) {        
        res.setHeader('Content-Type', 'application/json');
        try {
            const logDate = new Date().toISOString();
            console.info(`${logDate} Sync Started`);
            try {
                await mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
                res.statusCode = 200;
                res.end(JSON.stringify({
                    Status: 'Sync Finished',
                    URL: 'http://127.0.0.1'
                }))
            } catch (err) {
                throw new Error(err)
            }
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ err: err.message }));
        }
    }
}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.info('Listening on http://127.0.0.1:' + SERVER_PORT);
});
