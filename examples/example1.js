function foo(){
  var h = 1, g = 3

  function bar(q){
    var j = 3
    assert(j === q)
  }

  return bar(h) 
}

foo()()