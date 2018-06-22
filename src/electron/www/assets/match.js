module.exports = function Match(CrawlItem, Profile, OptOutr){
  const ipc = require('electron').ipcRenderer;

  let truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

  let match = {};
  match.profile = Profile;

  match.name = Profile.name || "";
  match.attr = {};
  match.id = Profile.id;
  match.attr.relatives = [];
  match.attr.age = Profile.age || "";
  match.attr.locations = (Profile.locations || []).slice(0, 5);
  match.attr.address = "";
  match.attr.text = truncate(Profile.text, 50, '...');
  match.attr.social = [];

  match.dom = null;

  match.emptyAttr = function(attr){
    let isEmpty = true;
    if(Array.isArray(attr) && attr.length > 0){
      isEmpty = false;
    }
    if(!Array.isArray(attr) && (attr !== "" || attr.length > 0)){
      isEmpty = false;
    }
    return isEmpty;
  };

  match.processAttr = function(key, attr){
    if(Array.isArray(attr)){
      return attr.join(" ");
    }
    return attr;
  };

  match.process = function(){
    match.dom.find(".name").text(match.name);
    let attrHTML = "";
    for(key in match.attr){
      let item = match.attr[key];
      if(!match.emptyAttr(item)){
        attrHTML += `<p>${key}: ${match.processAttr(key, item)}</p>`;
      }
    }
    match.dom.find(".attr").html(attrHTML);
    CrawlItem.addMatch(match);
  };

  match.clickedVerify = function(){
    let target = $(this);
    let isVerifedYes = target.is(".verifyYes");
    if(isVerifedYes){
      alert("YES");
      console.log("VERIFY YES", Profile);
    } else {
      ipc.send('removeMatch', OptOutr.activeProfileUUID, CrawlItem.driver, Profile.id);
      $(match.dom).remove();
    }
  };

  let bind = function(){
    $(match.dom).on('click', '.verifyYes, .verifyNo', match.clickedVerify);
    $(match.dom).on('click', 'h5', function(){
      let text = $(this).text();
      alert(text);
    });
  };

  let init = function(){
    let html = `
    <div class='match col-5'>
      <h5 class='name'></h5><br>
      <div class='attr'>
      </div>
      <div class='verify'>
        <p>Is this you? <a href=# class='verifyYes'>YES</a> <a href=# class='verifyNo'>NO</a></p>
      </div>
    </div>`;
    match.dom = $(html);
    
    bind();
    match.process();
    return match;
  };

  return init();
};