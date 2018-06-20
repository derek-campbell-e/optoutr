module.exports = function NightmareModule(){
  let nm = {};

  
  const Notifier = require('./notifier')(nm);

  nm.nightmare = require('./nightmare')();

  nm.drivers = {};

  nm.functionCreator = function(driverFuncs, key, args, affects, func){
    let obj = {};
    obj.args = args;
    obj.func = func;
    if(affects){
      obj.affects = affects;
    }
    driverFuncs[key] = obj;
  };

  nm.loadDrivers = function(){
    const fs = require('fs');
    const path = require('path');
    let dir = path.join(__dirname, 'drivers');
    
    let files = fs.readdirSync(dir);
    let drivers = files.filter(function(item){
      let ext = path.extname(item);
      return ext === ".js";
    });

    for(let driver of drivers){
      let driverName = path.basename(driver, '.js');
      let driverRequire = {};
      try {
        driverRequire = require(path.join(dir, driverName))(nm);
      } catch(error){
        console.log(error);
        continue;
      }
      driverRequire.name = driverName;
      nm.drivers[driverName] = driverRequire;
    }
  };

  nm.debug = function(){
    Notifier.debug.apply(Notifier, arguments);
  };

  nm.routine = function(person){
    let driverKeys = Object.keys(nm.drivers);
    let loop = function(){
      let driverKey = driverKeys.shift();
      if(typeof driverKey === "undefined"){
        return;
      }
      let driver = nm.drivers[driverKey];
      let scope = {};
      scope.driver = driverKey;
      if(!driver.enabled){
        return loop();
      }
      let routine = require('./routine')(nm, nm.nightmare, driver, loop);
      routine.run.call(scope, person);
    };
    loop();
  };

  nm.finishSite = function(profile){
    Notifier.debug(profile);
  };


  let init = function(){
    console.log("INITIALIZINGGGGGGGG");
    nm.loadDrivers();
    //Notifier.debug(nm.drivers);
    return nm;
  };

  process.on('exit', function(){
    nm.nightmare.end().then(function(){});
  });

  return init();
}();



