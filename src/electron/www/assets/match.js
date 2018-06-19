module.exports = function Match(CrawlItem){
  let match = {};

  match.name = "";
  match.attr = {};

  match.attr.relatives = [];
  match.attr.ages = "";
  match.attr.locations = [];
  match.attr.address = "";
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

  let bind = function(){
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
    </div>`;
    match.dom = $(html);
    
    bind();
    return match;
  };

  return init();
};