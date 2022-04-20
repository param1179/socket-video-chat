let roomsList = [];
var roomLikes = {};

const stream = (io, socket) => {

    socket.emit("connected", "Hello and Welcome to the Server");

    socket.on('get-active-users', async () => {
        const actUsers = []
        const activeUsers = await io.of('/stream').allSockets()
        activeUsers.forEach((value) => actUsers.push(value))
        io.of('/stream').emit('get-active-users', { activeUsers: actUsers })
    })

    socket.on('create-room', (room) => {
        if (socket.adapter.rooms.has(room.name) === false) {
            socket.join(room.name);
            socket.join(room.socketId)
            roomsList.push(room.name)
            socket.emit('create-room', { msg: 'Room created successfully', data: room })
        } else {
            socket.emit('create-room', { msg: 'This room already exist' })
        }
    });

    socket.on('join-room', async (room) => {
        if (socket.adapter.rooms.has(room.name) === true) {
            socket.join(room.name);
            socket.join(room.socketId)
            const ids = await io.of('/stream').in(room.name).allSockets();
            io.of('/stream').to(room.name).emit('join-room', {
                msg: `New user joined id: ${socket.id}`,
                totalUsers: ids.size,
                userId: socket.id,
                data: room 
            })
        } else {
            socket.emit('join-room', {
                msg: `This room is not exist`,
                totalUsers: 0,
                userId: '',
                data: room 
            })
        }
    });

    socket.on('leave-room', async (room) => {
        if (socket.adapter.rooms.has(room.name) === true) {
            socket.leave(room.name);
            const ids = await io.of('/stream').in(room.name).allSockets();
            io.of('/stream').to(room.name).emit('leave-room', {
                msg: `User left id: ${socket.id}`,
                totalUsers: ids.size,
                userId: socket.id,
                data: room
            })
        } else {
            socket.emit('leave-room', { msg: 'Something went wrong' })
        }
    });

    socket.on('get-rooms-list', () => {
        socket.emit('get-rooms-list', { rooms: roomsList })
    })

    socket.on('get-rooms-users', async (room) => {
        const ids = await io.of('/stream').in(room.name).allSockets();
        socket.emit('get-rooms-users', { users: ids.size })
    })

    socket.on('delete-room', async (room) => {
        if (socket.adapter.rooms.has(room.name) === true) {
            io.of('/stream').to(room.name).emit('delete-room', {
                msg: `Room deleted: ${room.name}`
            })
            io.of('/stream').in(room.name).socketsLeave(room.name);
            var index = roomsList.indexOf(room.name)
            roomsList.splice(index, 1)
            delete roomLikes[room.name]
        } else {
            socket.emit('leave-room', { msg: 'room not exist' })
        }
    })

    socket.on('room-chat', (chat) => {
        io.of('/stream').to(chat.room).emit('room-chat', { sender: chat.sender, msg: chat.msg, data: chat });
    });

    socket.on('room-likes', (room) => {
        if (socket.adapter.rooms.has(room.name) === true) {
            roomLikes[room.name] = roomLikes[room.name] ? roomLikes[room.name] + 1 : 1
            io.of('/stream').to(room.name).emit('room-likes', roomLikes[room.name])
        } else {
            socket.emit('room-likes', `${room.name} not exist`)
        }
    })

    socket.on('room-link', (room) => {
        if (socket.adapter.rooms.has(room.name) === true) {
            io.of('/stream').to(room.socketId).emit('room-link', { roomName: room.name, sender: room.sender, data: room })
        } else {
            socket.emit('room-link', { msg: `${room.name} not exist` })
        }
    })

    socket.on("disconnect", () => {
        io.of('/stream').emit('disconnect-user', { msg: 'User disconnected', userId: socket.id })
    });





    socket.on('subscribe', async (data) => {
        //subscribe/join a room
        socket.join(data.room);
        socket.join(data.socketId);
        const roomData = {
            room: data.room,
            userId: data.socketId
        }
        roomUsers.push(roomData);
        const ids = await io.of('/stream').in(data.room).allSockets();
        io.of('/stream').to(data.room).emit('subscribeResponse', { msg: 'room created successfully', count: ids.size })
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

    socket.on('likes', (data) => {
        likes = likes + 1
        io.emit('likes', likes)
    })
};

module.exports = stream;
