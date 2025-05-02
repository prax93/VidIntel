import { createServer } from 'node:http';
import mediastat from './mediastat.js';
import jsonCreator from './jsonCreator.js';


const SERVER_PORT = process.env.SERVER_PORT

const server = createServer(handler)

async function handler(req, res) {
    const requestUrl = req.url;

    if (requestUrl.includes('/refresh')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            console.log('started Sync !!')
            res.end(JSON.stringify(
                {"Status": "Check Synced Items",
                "Redirect-url": `http://127.0.0.1:${SERVER_PORT}/status`}
            ))
            await mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
            console.log('Done !!!')
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    else if(requestUrl.includes('/json')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            jsonCreator.reader('./movies.json', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
                } else {
                    res.end(data);
                }
            });
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
        }
    }

    else if(requestUrl.includes('/status')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            res.end(JSON.stringify(mediastat.getVideoMetaData()))
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read movies.json' }));
        }
    }
}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.info('Listening on http://127.0.0.1:' + SERVER_PORT);
});
