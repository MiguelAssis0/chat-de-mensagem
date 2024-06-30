const { Server } = require("socket.io");
const { join } = require('node:path');

const express = require("express");
const { CreateServer, createServer } = require('node:http');

const app = express();
const server = createServer(app);

const io = new Server(server);

let usuarios = [];
let socketIds = [];
let msg = [];

app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    
    
    socket.on('new user', (data)=>{
        if(usuarios.indexOf(data) != -1){
            socket.emit('new user', {success: false});
        }else{
            usuarios.push(data);
            socketIds.push(socket.id);
            socket.emit('new user', {success: true});
            socket.broadcast.emit('usu', data+' entrou no chat');
            msg.forEach((obj) => {
                socket.emit('chat message', obj);
            })
        }
    })

    socket.on('chat message', (obj) => {
        if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
            io.emit('chat message', obj);
            msg.push(obj);
        }else{
            console.log('erro');
        }
       
    })

    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id);
        socketIds.splice(id,1);
        usuarios.splice(id,1);
        
    })
})


server.listen(3000, () => console.log('listening on *:3000'));