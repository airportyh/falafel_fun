var fs = require('fs');
var falafel = require('falafel');
var estraverse = require('estraverse');
var filename = process.argv[2];

var code = fs.readFileSync(filename) + '';

code = falafel(code, function(node){
  if (isAssert(node)){
    var predicate = node.arguments[0];
    var predicateSrc = predicate.source();
    var exprs = subExpressions(predicate);
    node.update(
      'if (!(' + predicateSrc + ')){ ' +
        'throw new Error("' + predicateSrc + ' failed."' + 
          ' + ' + 
          (exprs.map(function(expr){
            var src = expr.source();
            return '"\\n  ' + src + ' = " + ' + src;
          }).join(' + ') || '""') +
        ');' + 
      ' }');
  }
})

console.log(code);

function isAssert(node){
  return node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'assert';
}

function subExpressions(predicate){
  var exprs = [];
  estraverse.traverse(predicate, {
    enter: function(node){
      if (
        predicate !== node &&   // exclude the original expression itself
        node.type !== 'Literal' // don't want string/number/etc literals
      ){
        exprs.push(node);
      }
      // Skip the nodes under MemberExpression
      // because it's property name as an identifier
      // will not be recognizable as a variable
      if (node.type === 'MemberExpression') this.skip();
    }
  });
  return exprs;
}