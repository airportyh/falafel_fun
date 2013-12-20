var fs = require('fs');
var falafel = require('falafel');
var filename = process.argv[2];

var code = fs.readFileSync(filename) + '';

code = falafel(code, function(node){
  if (isAssert(node)){
    var predicate = node.arguments[0];
    node.update(
      'if (!(' + predicate.source() + ')){ ' +
      'throw new Error("' + predicate.source() + ' failed.");' + 
      ' }');
  }
})

console.log(code);

function isAssert(node){
  return node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'assert';
}