// const WebSocket = require('ws');
// const http = require('http');

// // Create an HTTP server
// const server = http.createServer();
// const wss = new WebSocket.Server({ server });

// // Handle WebSocket connections
// wss.on('connection', function connection(ws) {
//     console.log('A new client connected');
//     //Echo the received message back to the client
//     ws.send(message.toString('utf-8').toUpperCase());
//     ws.on('message', function incoming(message) {
//         console.log('Received %s', message);

//         // Broadcast the received message to all connected clients
//         wss.clients.forEach(function each(client) {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(message.toString('utf-8').toUpperCase());
//             }
//         });
//     });

//     ws.on('close', function close() {
//         console.log('Client disconnected');
//     });
// });

// // Listen on a dynamically obtained port
// server.listen(0, () => {
//     const address = server.address();
//     console.log(`WebSocket server is running on port ${address.port}`);
// });

// // Expose an API endpoint to retrieve the port number
// server.on('request', (req, res) => {
//     if (req.url === '/port' && req.method === 'GET') {
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify({ port: server.address().port }));
//     } else {
//         res.statusCode = 404;
//         res.end('Not found');
//     }
// });



const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', function connection(ws) {
    console.log('A new client connected');

    ws.on('message', function incoming(message) {
        console.log('Received %s', message);
        //Echo the received message back to the client
        ws.send(message.toString('utf-8').toUpperCase());
        // Broadcast the received message to all connected clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString('utf-8').toUpperCase());
            }
        });
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });

    // Echo the received message back to the client
    // This should be outside of the message event
    // You cannot access message before it is defined
    // ws.send(message.toString('utf-8').toUpperCase());
});

// Expose an API endpoint to retrieve the port number
app.get('/port', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ port: server.address().port }));
});

// Start the server
server.listen(0,() => {
    const port = server.address().port;

    console.log(`WebSocket server is running on port ${port}`);
});
