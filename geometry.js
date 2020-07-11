

/*
A point is given by a orthogonal matrix, hopefully. These represent the
transformation when going from the north pole to the point. They have
orientations.

Thus we need some Linear Algebra!!!

*/


// Important maths constants
const TAU = Math.PI * 2;


///
/// LINEAR ALGEBRA!!!
///

// We're using math.js: https://mathjs.org/

// Point where a matrix sends [1, 0, 0]
function pt(A) {
  return math.transpose(math.row(A,0));
}

// Standard vector / matrix operations.
let dot = math.dot;
let mt = math.multiply;
let add = math.add;
let sub = math.subtract;
let sqrt = math.sqrt;
let sin = math.sin;
let cos = math.cos;


// Cache inverse
let inv = (A) => {
  return A.inverseCache || (A.inverseCache = math.inv(A));
}


// Identity matrix
const identity = math.identity(3);




// Normalize a matrix, using Gram Schmidt
function normalize(A) {
  let v0 = math.column(A, 0);
  let v1 = math.column(A, 1);
  let v2 = math.column(A, 2);

  // Normalize the first vector
  let w0 = mt(1 / sqrt(dot(v0, v0)), v0);

  // Make v1 perpendicular to v0
  let u1 = sub(v1, mt(w0, dot(v1, w0)));

  // Normalize v1
  let w1 = mt(1 / sqrt(dot(u1, u1)), u1);

  // Make v2 perpendicular to
  let u2 = sub(sub(v2, mt(w0, dot(v2, w0))), mt(w1, dot(v2, w1)));

  // Normalize v2
  let w2 = mt(1 / sqrt(dot(u2, u2)), u2);

  return math.concat(w0, w1, w2);
}

// Standard matrices, rotations, movements forwards, sideways, etc.

// A matrix used to represent forwards motion
function forwards(t) {
  return math.matrix([
    [cos(t), -sin(t), 0],
    [sin(t),  cos(t), 0],
    [     0,       0, 1]
  ])
}

// A matrix used to represent sideways motion
function sideways(t) {
  return math.matrix([
    [cos(t), 0, -sin(t)],
    [     0, 1,       0],
    [sin(t), 0,  cos(t)]
  ])
}

// A function used to represent rotations!
function rot(t) {
  return math.matrix([
    [1,      0,       0],
    [0, cos(t), -sin(t)],
    [0, sin(t),  cos(t)]
  ])
}

// Interpolation, if that's ever necessary
function iplt(t, A, B) {
  return add( mt(t, A), mt((1-t), B ));
}

// conjugation
function conj (A, B) {
  return mt(mt(A, B), inv(A));
}























//.
