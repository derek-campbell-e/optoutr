module.exports = function OptoutServer(OptOutr){
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  const port = 4290;
  server.listen(port);

  io.on('connection', function(socket){
    socket.on('ready', function(){
      console.log("ITS READY!!!!");
      socket.emit('goto');
      socket.emit('runRoutine', {
        firstName: 'Beth',
        lastName: 'Campbell',
        locations: ['Riverside, CA', 'Lake Elsinore, CA']
      });
    });
    socket.on('debug', function(){
      console.log.apply(console, arguments);
    });
  });

};