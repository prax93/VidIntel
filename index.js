// server.mjs
import { createServer } from 'node:http';
import mediastat from './mediastat.js';


const SERVER_PORT = process.env.SERVER_PORT

const server = createServer(handler)

async function handler(req, res) {
    const requestUrl = req.url;

    if (requestUrl.includes('/refresh')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            await mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
            res.end('Finished Sync');
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            const data = mediastat.getVideoMetaData(); 
            res.end(JSON.stringify(data));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.info('Listening on 127.0.0.1:' + SERVER_PORT);
});
