import { io } from "socket.io-client";

const messageBtn = document.getElementById('msg-submit');
const roomBtn = document.getElementById('room-submit');
const clearBtn = document.getElementById('clear');
const disconBtn = document.getElementById('disconnect');

const msgField = document.getElementById('msg-field');
const textField = document.getElementById('text-field');
const roomField = document.getElementById('room-field');

const socket = io('http://localhost:3000');

socket.on('receive-message', message => {
    dispMessage(message);
})

socket.on('connect', () => {
    clearTextField();
    dispMessage(`You are connected to ${socket.id}`);
})

messageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = msgField.value;
    const room = roomField.value;

    if (message === '') { return }
    dispMessage(message);
    socket.emit('send-message', message, room);

    msgField.value = '';
});

roomBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const room = roomField.value;
    socket.emit('join-room', room, message => {
        dispMessage(message);
    });
    console.log(roomField.value);
})

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearTextField();
})

disconBtn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.disconnect();
    dispMessage('Disconnected');
    setTimeout(() => {
        window.close();
    }, 2000);
})

const dispMessage = (text) => {

    if (text === '') {
        alert('Please enter a message');
        return;
    }

    textField.value += "\n" + text + "\n";
}

const clearTextField = () => {
    if (textField.value !== '') {
        textField.value = '';
    } else {
        return;
    }
}