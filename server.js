const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);

const users = {};

app.use(express.static(path.join(__dirname,`public`)))

const socketio = require('socket.io')(server);

socketio.on('connection', socket=> {
    socket.on('send-chat-message',message=> {
        socket.broadcast.emit(`chat-message`, {message: message, name: users[socket.id]})
    })
    
    socket.on('new-user',name=> {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected',name);
    })
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete  users[socket.id];
    });


});
server.listen(3000);
