// utils/generateToken.js
// This utility function generates a JWT (JSON Web Token)
// for a given user ID.
//
// What is a JWT?
// A JWT is a string that looks like this:
// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123
// It has 3 parts separated by dots:
// 1. Header   → algorithm used
// 2. Payload  → data stored inside (userId)
// 3. Signature → proof that it wasn't tampered
//
// The server creates this token and sends it to the client.
// The client sends it back with every request.
// The server verifies it and knows who the user is.

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload — data stored in token
    process.env.JWT_SECRET,   // Secret key — used to sign the token
    { expiresIn: process.env.JWT_EXPIRES_IN } // Token expires in 7 days
  );
};

module.exports = generateToken;