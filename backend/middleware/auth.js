const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('A token is required');

  const bearerToken = token.split(' ')[1]; 

  try {
    const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    req.user = user; 
  } catch (err) {
    console.log(err);
    return res.status(401).send('Invalid Token');
  }

  return next();
};

module.exports = auth;
