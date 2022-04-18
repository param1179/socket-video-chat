let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
let stream = require('./ws/stream');
let path = require('path');
let favicon = require('serve-favicon');
const { Socket } = require('socket.io');
require('dotenv').config();

let PORT = process.env.PORT || 8000;

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const Io = io.of('/stream').on('connection', (socket) =>{
    stream(Io, socket)
});

server.listen(PORT, () => console.log('Listening on PORT', PORT));