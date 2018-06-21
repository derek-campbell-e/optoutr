module.exports = function OptOutr(){
  const fork = require('child_process').spawn;

  let oo = {};
  oo.profiles = require('./profiles')(oo);
  let Server = require('../server')(oo);

  oo.nightmarePath = require('path').join(__dirname, '..', 'nightmare/index.js');
  oo.electron = require('../electron')(oo);

  
  oo.nightmare = fork('node', [oo.nightmarePath], {
    stdio: 'pipe'
  });

  oo.nightmare.stderr.pipe(process.stdout);
  oo.nightmare.stdout.on('data', function(){
    
  });


  return oo;
};