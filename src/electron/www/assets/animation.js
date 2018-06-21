

module.exports = function siteAnimation(){
  var sa = {};

  sa._alpha = 1;

  var random = function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  var gridItem = function(options){
    var gi = {};
    gi.options = options;
    gi.type = options.type;
    gi.shape = options.shape;
    gi.nest = options.nest;
  };

  sa.shapes = [];
  sa.grids = [];

  sa.drawingBoard =  SVG('portfolio-drawing');

  sa.shapeCreator = function(nest, boxSize, padding, x, y){
    var shapes = ['rect', 'circle', 'triangle', 'hexagon'];
    var shapeIndex = (x) % shapes.length;
    var shapeSize = boxSize - (padding * 2);
    nest.rect(boxSize, boxSize).fill('none');//.stroke({width: 2, color: '#f06'});

    var shape = shapes[shapeIndex];
    var _shape = null;
    switch(shape){
      case 'circle':
        _shape = nest.circle(shapeSize, shapeSize).fill('none').stroke({width: 4});
      break;
      case 'triangle':
        _shape = nest.path('M77.5 55.97L95 84.29L60 84.29L25 84.29L42.5 55.97L60 27.65L77.5 55.97Z').fill('none').stroke({width: 8});
        _shape.scale(0.5, 0.5)
      break;


      case 'hexagon':
        _shape = nest.path('M60 15.12L20 37.56L20 82.44L60 104.89L100 82.44L100 37.56L60 15.12Z').fill('none').stroke({width: 8});
        _shape.scale(0.5, 0.5)
      break;


      default:
        _shape = nest.rect(shapeSize, shapeSize).radius(2).fill('none').stroke({width: 4});
      break;
    }

    _shape.stroke({color: sa.colorize(x, y)});
    _shape.attr({'stroke-linecap': "round"});
    _shape.opacity(sa._alpha);
    _shape.cx(boxSize / 2).cy(boxSize / 2);
    
  };

  sa.colorize = function(x, y){
    var colors = ["#f06", "#e6e9f2", "#485471", "#5f86e3"];
    var color = colors[(x + y) % colors.length];
    return color;
  };

  sa.alpha = function(alpha){
    sa._alpha = alpha;
    for(nest of sa.nests){
      nest.get(1).opacity(alpha);
    }
  };


  sa.createGrid = function(){
    for(var nest in sa.nests){
      nest = sa.nests[nest];
      nest.clear();
    }

    var size = 42;

    var boxSize = size * 3;
    var padding = size;
    var cols = Math.ceil($(window).width() / boxSize);
    var rows = Math.ceil($(window).height() / boxSize);
    //loop through this;
    var nests = [];

    for(var i = 0; i < rows; i ++){
      var even = i % 2 === 0;
      if(even){
        for(var e = 0; e < cols; e++){
          var nested = sa.drawingBoard.nested();
          nested.attr({x: boxSize * e, y: boxSize * i}).width(boxSize).height(boxSize);
          sa.shapeCreator(nested, boxSize, padding, e, i);
          nests.push(nested);
        }
      } else {
        for(var e = 0; e < cols + 1; e++){
          var nested = sa.drawingBoard.nested();
          nested.attr({x: (boxSize * e) - (boxSize / 2), y: boxSize * i}).width(boxSize).height(boxSize);
          sa.shapeCreator(nested, boxSize, padding, e, i);
          nests.push(nested);
        }
      }
    }
    sa.nests = nests;
    sa.randomRotate();
  };

  sa.randomRotate = function(){
    for(var nest in sa.nests){
      nest = sa.nests[nest];
      nest.get(1).rotate(random(0, 360));
    }
  };

  sa.animateNests = function(){
    var randomIndexes = [];
    for(var i = 0; i < 50; i ++){
      var randomIndex = random(0, sa.nests.length - 1);
      randomIndexes.push(randomIndex);
    }
    for(var index in randomIndexes){
      index = randomIndexes[index];
      var nest = sa.nests[index];
      nest.get(1).animate(1000, 'bounce').rotate(random(0, 90));
    }

  };

  sa.init = function(){
    //sa.createShapes();
    setInterval(sa.animateNests, 5000);
    sa.createGrid();

    $(window).resize(sa.createGrid);
    return sa;
  };

  return sa.init();
};