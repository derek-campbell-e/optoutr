module.exports = function OptOutrWeb(){
  const ipc = require('electron').ipcRenderer;
  const Profiles = require('../../../optoutr/profiles')();
  let oo = {};
  let profiles = {};

  try {
    profiles = Profiles.export();
    console.log(profiles);
  } catch (error){
    console.log(error);
  }

  oo.activePanel = "profileSplash";
  oo.activeScreen = "profileScreen";
  oo.activeProfileUUID = null;

  oo.screens = {
    "loginScreen": [],
    "profileScreen": ['searchRoutine', 'profileEdit', 'profileSplash']
  };


  let CrawlItem = require('./crawl-item');

  let validDOB = function(value, format){
    format = format || "MM/DD/YYYY";
    let moment = require('moment');
    let dob = moment(value, format);
    return dob.isValid();
  };



  oo.transition = function(screen, panel, force, outCallback, inCallback){
    screen = screen || oo.activeScreen;
    force = force || false;
    outCallback = outCallback || function(){};
    inCallback = inCallback || function(){};

    if(screen !== oo.activeScreen){
      $(`#`+oo.activeScreen).fadeOut(function(){
        outCallback();
        oo.activeScreen = screen;
        $("#"+panel).show();
        $("#"+screen).fadeIn(function(){
          $("#"+screen).css('display', null);
          inCallback();
        });
      });
      return;
    }

    if(panel !== oo.activePanel || force){
      $(`#`+oo.activePanel).fadeOut(function(){
        outCallback();
        oo.activePanel = panel;
        $("#"+panel).fadeIn(function(){
          $("#"+panel).css('display', null);
          inCallback();
        });
      });
    }

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
      govID: "",
      UUID: oo.activeProfileUUID
    };

    for(let key in form){
      let dom = $(`#${key}`);
      let value = "";
      try {
        value = dom.val().trim();
      } catch (error) {

      }
      
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
          }
        break;
        case 'UUID':
          continue;
        break;
        default:
        break;
      }
      form[key] = value;
    }
    if(canSubmit){
      ipc.send('addOrEditProfile', form);
      setTimeout(oo.refreshProfiles, 1000);
      $("#readyToGo").css('display', 'flex');
    } else {
      console.log("NOT GONNA SUBMIT");
    }
    return false;
  };

  oo.onAddOrEditProfile = function(){

  };

  oo.refreshProfiles = function(){
    profiles = Profiles.refresh();
    console.log(profiles);
    oo.loadProfiles();
  };

  oo.loadProfiles = function(){
    $(".profiles-wrapper").html(null);
    let html = ``;
    for(let UUID in profiles){
      let profile = profiles[UUID];
      let profileName = profile.fullName;
      html += `<div class='row'><div class='col profile' data-id='${UUID}'><h4>${profileName}</h4></div></div>`;
    }
    let dom = $(html);
    $(".profiles-wrapper").append(dom);
  };

  oo.loadProfile = function(){
    let dom = $(this);
    let profileName = dom.attr('data-id');
    let profile = profiles[profileName];
    
    oo.transition(null, "profileEdit", true, function(){
      oo.updateFormWithProfile(profile);
      oo.showPastResultsDialogue(profile);
      oo.activeProfileUUID = profile.UUID;
    });
    
  };

  oo.showPastResultsDialogue = function(profile){
    if(profile.sites && Object.keys(profile.sites).length > 0){
      $("#pastResults").fadeIn(function(){
        $("#pastResults").css('display', 'flex');
      });
    }
  };

  oo.viewPastResults = function(){
    let profile = profiles[oo.activeProfileUUID];
    console.log(profile);
    oo.transition(null, 'searchRoutine', true, function(){
      console.log("RINNNING");
      for(let site in profile.sites){
        oo.foundProfiles(null, {name: site}, profile.sites[site]);
      }
    });
  };

  oo.clearProfileFields = function(){
    oo.activeProfileUUID = null;
    $("#profileEdit :input").val(null);
  };

  oo.addNewProfile = function(){
    oo.transition(null, "profileEdit", true, function(){
      oo.clearProfileFields();
    });
  };

  oo.updateFormWithProfile = function(profile){
    for(let key in profile){
      let dom = $(`#${key}`);
      switch(key){
        case 'locations':
        case 'relatives':
          let value = profile[key].join("\n");
          dom.val(value);
        break;
        default:
          dom.val(profile[key]);
        break;
      }
    }
  };

  oo.startSearch = function(){
    let activeProfileUUID = oo.activeProfileUUID;
    let profile = profiles[activeProfileUUID];
    oo.transition(null, 'searchRoutine', true, function(){

    });
    ipc.send('runRoutine', profile);
  };

  oo.foundProfiles = function(event, driver, profiles){
    let crawlItem = require('./crawl-item')(oo, driver.name);
    crawlItem.createMatch(profiles);
  };

  let bind = function(){
    $(document).on('click', '#login', oo.processLogin);
    $(document).on('click', '#addOrEditProfile', oo.addOrEditProfile);
    $(document).on('click', '.profile[data-id]', oo.loadProfile);
    $(document).on('click', '#addProfile', oo.addNewProfile);
    $(document).on('click', '#startSearch', oo.startSearch);
    $(document).on('click', '#viewPastResults', oo.viewPastResults);
    ipc.on('onAddOrEditProfile', oo.onAddOrEditProfile);
    ipc.on('onSuccessfulLogin', oo.onSuccessfulLogin);
    ipc.on('foundProfiles', oo.foundProfiles);
  };

  let init = function(){
    bind();
    oo.loadProfiles();
    return oo;
  };

  return init();
};