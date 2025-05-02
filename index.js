import { createServer } from 'node:http';
import mediastat from './mediastat.js';
import jsonCreator from './jsonCreator.js';

const SERVER_PORT = process.env.SERVER_PORT
const server = createServer(handler)

async function handler(req, res) {
    const requestUrl = req.url;

    if (requestUrl ==='/') {
    try {
        jsonCreator.reader('./movies.json', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
            } else {
                const movies = JSON.parse(data);
                res.end(JSON.stringify(movies));
            }
        });
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
    }
    }      

    else if (requestUrl.includes('/refresh')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            const logDate = new Date().toISOString();
            console.info(`${logDate} Sync Started`);
            res.write(JSON.stringify(
                {"Status": "Sync in Progress",
                "Redirect-url": `http://127.0.0.1:${SERVER_PORT}/status`}
            ));
            res.end();
            try {
                const logDate = new Date().toISOString();
                await mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
                console.info(`${logDate} Sync Finished sucessfully`);
            } catch (err) {
                console.error('Error during sync:', err);
            }
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    else if(requestUrl.includes('/json')) {
        const current_url = new URL(req.url, `http://${req.headers.host}`);
        const search_params = current_url.searchParams;
        const search = search_params.get('search');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            jsonCreator.reader('./movies.json', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
                } else {
                    const movies = JSON.parse(data);
                    const filteredMovies = search ? movies.filter((movie) => movie.name.toLowerCase().includes(search.toLowerCase())) : movies;
                    res.end(JSON.stringify(filteredMovies));
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    else if(requestUrl.includes('/status')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const data = mediastat.getVideoMetaData();
        if(data.length == 0){
            const response = {
                "Status": "Sync not finished, please refresh at a later point"
            }
            res.end(JSON.stringify(response))}
        else {
            res.end(JSON.stringify(data))
        }
    }
}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.info('Listening on http://127.0.0.1:' + SERVER_PORT);
});
