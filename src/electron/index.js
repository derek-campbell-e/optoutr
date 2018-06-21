module.exports = function ElectronModule(OptOutr){
  const path = require('path');
  const {app, BrowserWindow} = require('electron')
  const ipc = require('electron').ipcMain;

  let em = {};
  em.www = path.join(__dirname, 'www');
  em.indexPage = path.join(em.www, 'index.html');
  
  em.windowsPath = path.join(__dirname, '..', '..', 'windows.json');

  em.window = {};
  em.windowName = 'gui';
  em.updateTimer = null;

  let windows = {};

  try {
    windows = require(em.windowsPath);
    em.window = windows[em.windowName];
  } catch(error){
    em.window = {width: 800, height: 600, x: 0, y: 0};
  }

  em.updateDimensions = function(){
    clearTimeout(em.updateTimer);
    let dimensions = mainWindow.getBounds();
    let dim = {x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.height};
    windows[em.windowName] = dim;
    let json = JSON.stringify(windows, null, 4);
    em.updateTimer = setTimeout(function(){
      require('fs').writeFile(em.windowsPath, json, console.log);
    }, 1000);
  };

  let mainWindow

  function createWindow () {
    let options = em.window;
    options.minWidth = 600;
    options.minHeight = 700;
    mainWindow = new BrowserWindow(options);
    mainWindow.loadFile(em.indexPage);
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
    mainWindow.on('move', em.updateDimensions);
    mainWindow.on('resize', em.updateDimensions);
    ipc.on('processLogin', function(event, args){
      console.log("GOT AN EVENT");
      event.sender.send('onSuccessfulLogin');
    });
    ipc.on('addOrEditProfile', function(event, form){
      OptOutr.profiles.createProfile(form, function(error){
        console.log("DONE");
      });
    });
    ipc.on('runRoutine', function(event, profile){
      console.log("READY TO GO WITH PROFILE", profile);
      OptOutr.activeSocket.emit('runRoutine', profile);
    });
  }

  app.on('ready', createWindow);

  
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });

  return em;
};