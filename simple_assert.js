var n = 0;
assert(n > 0);

function assert(condition){
  if (!condition){
    throw new Error('Assertion failed.')
  }
}