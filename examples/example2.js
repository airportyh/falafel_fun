function Man(name){
  this.name = name
}

Man.prototype.greet = function(){
  return 'hello world'
}

function main(){
  var bob = new Man('bob')
  var dan = Man('dan')

  assert(bob != null)
  //assert(bob.greet() === 'hello')
  assert(dan != null)
}

main()