const { instrument } = require('@socket.io/admin-ui');

const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080", "https://admin.socket.io"],
        credentials: true
    }
});

let count = 0;

io.on('connection', socket => {
    count++;
    console.log(socket.id);
    console.log(`${count} users connected`);
    socket.on('send-message', (message, room) => {
        if (room === '') {
            socket.broadcast.emit('receive-message', message);
        } else {
            socket.to(room).emit('receive-message', message);
        }
    })

    socket.on('join-room', (room, cb) => {
        socket.join(room);
        cb(`Joined room ${room}`);
    })

    socket.on('disconnect', () => {
        count--;
        console.log("Disconnected " + socket.id);
        console.log(`${count} users connected`);
    })
});

instrument(io, { auth: false });