// server.mjs
import { createServer } from 'node:http';
import mediastat from './mediastat.js';


const SERVER_PORT = process.env.SERVER_PORT

const server = createServer(handler)

function handler (req, res){
    const requestUrl = req.url;
    if(requestUrl.includes('/media')){
        const url = new URL(req.url, `http://${req.headers.host}`);
        // const params = Object.fromEntries(url.searchParams.entries());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        try {
            const data = mediastat.readMediaInfos(process.env.MEDIA_LOCATION);
            res.end(JSON.stringify(data));
        } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
        finally {
            mediastat.clear()
        }
    }
}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.info('Listening on 127.0.0.1:' + SERVER_PORT);
});
