//for easily access to paths inside the project
const path = require('path');
//load http
const http = require('http');
//load express
const express = require('express');
//load socket.io
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
//config the env PORT variable
const port = process.env.PORT || 3000;
//import generateMessage
const {generateMessage} = require('./utils/message');

//configure our express application
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

//config express static middleware
app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New User connected.');

  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

  socket.on('createMessage',(message) => {
    //var createdAt = new Date().toString();
    //console.log('createMessageEvent : ', message , createdAt);
    io.emit('newMessage',generateMessage(message.from, message.text));
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('disconnect',() =>{
    console.log('User Disconnected');
  });
});

server.listen(port,() => {
  console.log(`Server is up on port ${port}`);
});
