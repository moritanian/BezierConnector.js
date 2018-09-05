window.onload = ()=>{

  let index = 0;
  function createElement(){
    index ++;
    return  $(`<div class='elem elem${index}' id='x${index}'><div class='inner-elem'>${index}</div> </div>`).get(0);
  }
  let $elem1 = createElement();
  let $elem2 = createElement();
  let $elem3 = createElement();
  let $elem4 = createElement();
  let $elem5 = createElement();
  //$("#example").get(0).appendChild($elem1);
  //$("#example").get(0).appendChild($elem2);
  

  let container = $("#example").get(0);
  let TreeIns = Tree.getInstance( container, 300, 500 );
  let root = new TreeIns($elem1);
  let child = root.append($elem2);
  child.append($elem3);

  root2 = TreeIns.fromArray([$elem4, $elem5]);

  root.append( root2);
  root.optimize();
};