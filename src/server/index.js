module.exports = function OptoutServer(OptOutr){
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  const port = 4290;

  let activeSocket = null;
  server.listen(port);

  io.on('connection', function(socket){
    activeSocket = socket;
    OptOutr.activeSocket = activeSocket;
    socket.on('ready', function(){
      console.log("ITS READY!!!!");
      socket.emit('goto');
      
      
    });
    socket.on('debug', function(){
      console.log.apply(console, arguments);
    });
    socket.on('foundProfiles', function(){
      OptOutr.foundProfiles.apply(OptOutr, arguments);
      console.log("FOUND THEM BITCHES");
    });
  });

  process.on('exit', function(){
    io.close();
  });

  process.on('SIGINT', function(){
    io.close();
  });

};