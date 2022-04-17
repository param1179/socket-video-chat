const stream = (socket) => {
    var activeUsers = [];
    
    socket.emit("connected", "Hello and Welcome to the Server");

    socket.on('join', (data) => {
        socket.name = data.name
        socket.userId = socket.id
        const userData = {
            name: data.name,
            userId: socket.id
        }
        activeUsers.push(userData);
        socket.emit("join", activeUsers);
    })

    socket.on('subscribe', (data) => {
        //subscribe/join a room
        socket.join(data.room);
        socket.join(data.socketId);

        //Inform other members in the room of new user's arrival
        if (socket.adapter.rooms.has(data.room) === true) {
            socket.to(data.room).emit('new user', { socketId: data.socketId });
        }
    });

    socket.on('unsubscribe', (data) => {
        //subscribe/join a room
        socket.leave(data.room);
        socket.leave(data.socketId);

        //Inform other members in the room of new user's arrival
        if (socket.adapter.rooms.has(data.room) === true) {
            socket.to(data.room).emit('leave user', { socketId: data.socketId });
        }
    });


    socket.on('newUserStart', (data) => {
        socket.to(data.to).emit('newUserStart', { sender: data.sender });
    });


    socket.on('sdp', (data) => {
        socket.to(data.to).emit('sdp', { description: data.description, sender: data.sender });
    });


    socket.on('ice candidates', (data) => {
        socket.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender });
    });


    socket.on('chat', (data) => {
        socket.to(data.room).emit('chat', { sender: data.sender, msg: data.msg });
    });

    socket.on("disconnect", () => {
        activeUsers.splice(activeUsers.findIndex(function (i) {
            return i.userId === socket.userId;
        }), 1);
        socket.emit("user-disconnected", activeUsers);
    });
};

module.exports = stream;
