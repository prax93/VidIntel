// server.mjs
import { createServer } from 'node:http';

const SERVER_PORT = process.env.SERVER_PORT

const server = createServer(handler)


function handler (req, res){
    const requestUrl = req.url;

    if (requestUrl === '/homeserver') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        const jsonObject = {
            'Server-adress': '192.168.0.100',
            'Server-username': 'ubuntu'
        }

        res.end(JSON.stringify(jsonObject));
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(requestUrl.replace('/', '')); 
    }

}

server.listen(SERVER_PORT, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:' + SERVER_PORT);
});
