module.exports = function OptOutrWeb(){
  const ipc = require('electron').ipcRenderer;

  let oo = {};
  let CrawlItem = require('./crawl-item');

  let validDOB = function(value, format){
    format = format || "MM/DD/YYYY";
    let moment = require('moment');
    let dob = moment(value, format);
    console.log(dob);
    return dob.isValid();
  };

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

  oo.addOrEditProfile = function(){
    let canSubmit = true;
    let form = {
      firstName: "",
      lastName: "",
      dob: "",
      emailAddress: "",
      locations: "",
      relatives: "",
      govID: ""
    };
    for(let key in form){
      let dom = $(`#${key}`);
      let value = dom.val().trim();
      switch(key){
        case 'locations':
        case 'relatives':
          value = value.split(/\n/g);
        break;
        case 'dob':
          if(!validDOB(value)){
            dom.closest('.form-group').addClass('error');
            canSubmit = false;
            form[key] = '';
            alert("NOT VALID");
          }
          
    
        break;
        default:
        break;
      }
      form[key] = value;
    }
    console.log(form);
    return false;
  };

  let bind = function(){
    $(document).on('click', '#login', oo.processLogin);
    $(document).on('click', '#addOrEditProfile', oo.addOrEditProfile);
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