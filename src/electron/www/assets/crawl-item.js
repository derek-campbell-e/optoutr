module.exports = function CrawlItem(OptOutr, Driver){
  let ci = {};

  ci.driver = Driver;
  ci.progress = 0;
  ci.matches = [];
  ci.approved = [];
  
  ci.dom = null;

  ci.createMatch = function(profiles){
    console.log("OUR PROFILES", profiles);
    for(let UUID in profiles){
      let profile = profiles[UUID];
      let match = require('./match')(ci, profile, OptOutr);
    }
  };

  ci.addMatch = function(match){
    ci.matches.push(match);
    ci.dom.find(".matches .wrapper").append(match.dom);
  };

  ci.addApproved = function(match){
    
  };

  ci.progress = function(progress){
    let perc = (progress * 100);
    let percSign = perc + "%";
    ci.dom.find(".progress-bar").width(percSign).text(percSign);
  };

  let bind = function(){
    $(ci.dom).on('click', '.match', function(){
      //alert("CLICKED");
    })
  };

  let init = function(){
    let html = `<div class='crawl-result row'>
    <div class='col wrapper'>

      <div class='row'>
        <div class='col'>
          <h4>${ci.driver}<br><small>MATCHES FOUND:</small></h4>
        </div>
        <!--
        <div class='col-2'>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
          </div>
        </div>
        -->
      </div>

      <div class='row matches'>
        <div class='col wrapper'>

            
        </div>
      </div>
    </div>
  </div>
`;
    ci.dom = $(html);
    $(".crawl-results").append(ci.dom);
    bind();
    return ci;
  };

  return init();
};