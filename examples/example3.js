var obj = {
  name: 'tom',
  getName: function(){
    return null
  }
}
assert(obj != null)
assert(obj.name === obj.getName())