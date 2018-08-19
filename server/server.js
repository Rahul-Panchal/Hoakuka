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

//configure our express application
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

//config express static middleware
app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New User connected.');

  socket.on('disconnect',() =>{
    console.log('User Disconnected');
  });
});

server.listen(port,() => {
  console.log(`Server is up on port ${port}`);
});
