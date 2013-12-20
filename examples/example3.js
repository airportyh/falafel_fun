var obj = {
  name: 'tom',
  getName: function(){
    return 'blah'
  }
}
assert(obj != null)
assert(obj.name === obj.getName())