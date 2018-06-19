module.exports = function NightmareModule(OptOutr){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({show: true, "x":-1885,"y":76,"width":1866,"height":800, waitTimeout: 1000 * 60 * 1000});
  console.log("OMG");
  nightmare
    .goto('https://duckduckgo.com')
    .wait(2000)
    .evaluate(function(){})
    .then(function(){
      console.log("DONE");
      process.exit(0);
    })
    .catch(function(error){
      console.error(error);
    })
  return nightmare;
}();



