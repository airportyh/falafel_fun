var falafel = require('falafel')
var estraverse = require('estraverse')
var fs = require('fs')
var assert = require('insist')

var filename = process.argv[2]

var scopeChain = []
fs.readFile(filename, function(err, data){
  var code = String(data)
  code = falafel(code, {loc: true}, function(node){
    if (node.type === 'CallExpression' &&
      node.callee.name === 'assert'){
      node.update(assertCode(node.arguments[0]))
    }
  })
  console.log(code)
})

function scopedParents(node){
  var chain = []
  var curr = node.parent
  while (curr){
    if (createsNewScope(curr)){
      chain.push(curr)
    }
    curr = curr.parent
  }
  return chain
}

function createsNewScope(node){
  return isFunction(node) ||
    node.type === 'Program';
}

function isFunction(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression'
}

function declaredVars(node){

  var vars = []

  if (isFunction(node)){
    node.params.forEach(function(param){
      vars.push(param.name)
    })
  }

  estraverse.traverse(node, {
    enter: function(nd){
      if (nd !== node && createsNewScope(nd)) this.skip()
      if (nd.type === 'VariableDeclarator'){
        vars.push(nd.id.name)
      }
    }
  })

  return vars

}

function varsReferencedInExpr(node){
  var vars = []
  estraverse.traverse(node, {
    enter: function(n){
      if (n.type === 'CallExpression') this.skip()
      if (n.type === 'Identifier'){
        vars.push(n.name)
      }
    }
  })
  return vars
}

function assertCode(node, vars){
  var line = node.loc.start.line
  var scopes = scopedParents(node)
  var errorLines = ['"' + node.parent.source() + ' failed."']

  var vars = varsReferencedInExpr(node)

  scopes.forEach(function(scope){
    var dvars = declaredVars(scope)
    dvars.forEach(function(vr){
      if (vars.indexOf(vr) === -1){
        vars.push(vr)
      }
    })
  })
  
  vars.forEach(function(vr){
    errorLines.push('"    ' + vr + ' = " + ' + vr)
  })

  var ret = 'if (!(' + node.source() + ')) { '
  ret += 'throw new Error(' + errorLines.join(' + "\\n" + ') + ')'
  ret += ' }'
  return ret
}