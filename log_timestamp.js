var fs = require('fs');
var falafel = require('falafel');

var filename = process.argv[2];

var code = fs.readFileSync(filename) + '';

code = falafel(code, function(node){
  if (isConsoleLog(node)){
    node.update('console.log(new Date() + ": " + ' + 
      node.arguments.map(function(arg){
        return arg.source();
      }).join(', ') + ')');
  }
});

console.log(code);

function isConsoleLog(node){
  return node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'console' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'log';
}