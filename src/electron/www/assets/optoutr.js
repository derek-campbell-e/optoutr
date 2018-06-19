module.exports = function OptOutrWeb(){
  const ipc = require('electron').ipcRenderer;

  let oo = {};
  let CrawlItem = require('./crawl-item');

  oo.processLogin = function(){
    let username = $("#username").val().trim();
    let password = $("#password").val().trim();
    ipc.send('processLogin', {username: username, password: password});
    return false;
  };

  oo.onSuccessfulLogin = function(event, args){
    $("#loginScreen").fadeOut(function(){
      $("#container").removeClass('container').addClass('container-fluid');
      $("#profileScreen").fadeIn();
    });
  };

  let bind = function(){
    $(document).on('click', '#login', oo.processLogin);
    ipc.on('onSuccessfulLogin', oo.onSuccessfulLogin);
  };

  let init = function(){
    bind();
    let crawlItem = CrawlItem(oo, 'BeenVerified');
    crawlItem.progress(0.89);
    oo.crawlItem = crawlItem;
    return oo;
  };

  return init();
};