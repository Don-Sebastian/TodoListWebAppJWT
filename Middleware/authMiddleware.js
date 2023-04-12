const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async(err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwtToken;

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          
          next();
        } else {
            const user = await User.findById(decodedToken.id);
            req.userId = user._id;
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
        next();
    }
}

function guestMiddleware(req, res, next) {
  const token = req.cookies.jwtToken;
  if (token) {
    res.redirect("/");
  } else {
    next();
  }
}

module.exports = { authMiddleware, checkUser, guestMiddleware };