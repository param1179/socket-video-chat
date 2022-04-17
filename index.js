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
require('dotenv').config();

let PORT = process.env.PORT || 8000;

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.of('/stream').on('connection', stream);

server.listen(PORT, () => console.log('Listening on PORT', PORT));