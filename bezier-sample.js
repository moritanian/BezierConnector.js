window.onload = ()=>{

  let $elem1 = $("<div class='elem elem1' id='x1'> </div>").get(0);
  let $elem2 = $("<div class='elem elem2' id='x2'> </div>").get(0);
  $("#example").get(0).appendChild($elem1);
  $("#example").get(0).appendChild($elem2);
  
  var bezier = new Bezier();

  bezier.init( $("#example").get(0) );

  bezier.draggable( $elem1);
  bezier.draggable( $elem2);
  let curveInfo = bezier.connect({
    from: $elem1, 
    to: $elem2
  });

  //bezier.disconnect(curveInfo)
 
/* 
  var svg = d3.select('#example').append('svg')
    .attr({
      width: 800,
      height: 800
    });


  function getInitCurve(){
    return [
    {
      //type: 'C',
      points: [
        {x: 150, y: 125},
        {x: 40, y: 30},
        {x: 240, y: 120},
        {x: 145, y: 200}
      ]
    }
  ];
  }

  function pathData(d) {
    var p = d.points;
      return [
        'M', p[0].x, ' ', p[0].y,
        'C', p[1].x, ' ', p[1].y,
        ' ', p[2].x, ' ', p[2].y,
        ' ', p[3].x, ' ', p[3].y,
      ].join('');
   // }
  }

window.beziers = [];
var cnt = 0;
//setBezier(getInitCurve());
//setBezier(getInitCurve());

function setBezier(curves){
  var mainLayer = svg.append('g').attr('class', 'main-layer');
  
  mainLayer.selectAll('x').data(curves)
    .enter().append('path')
    .attr({
      'class': function(d, i) { return 'curves path' + i; },
      d: pathData
    })
    .each(function (d, i) {
      window.beziers.push(d);
      d.drag = (x,y)=> { 
        d.points[0].x = x;
        d.points[0].y = y;
        pathElem.attr('d', pathData)};
      d.update = ()=>{pathElem.attr('d', pathData)}

      var pathElem = d3.select(this);
    
    });

  }
*/
};