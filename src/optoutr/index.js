module.exports = function OptOutr(){
  const fork = require('child_process').spawn;

  let oo = {};
  oo.nightmarePath = require('path').join(__dirname, '..', 'nightmare/index.js');
  oo.electron = require('../electron')(oo);

  /*
  oo.nightmare = fork('node', [oo.nightmarePath], {
    stdio: 'pipe'
  });
  oo.nightmare.on('data', console.log);
  oo.nightmare.on('exit', console.log);
  */

  return oo;
};