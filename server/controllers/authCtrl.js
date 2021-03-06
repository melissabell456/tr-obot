'use strict';
const passport = require('passport');

// creating new users
module.exports.displayRegister = (req, res) => {
  res.render('auth');
};

module.exports.register = (req, res, next) => {
  if (req.body.password === req.body.confirmation) {
    // first argument is name of the passport strategy we created in passport-strat.js
    passport.authenticate('local-signup', (err, user, msgObj) => {

      if (err) {  console.log(err); } //or return next(err)
      if (!user) { return res.render('auth', msgObj); }

      // Go ahead and login the new user once they are signed up
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        // Save a msg in a cookie whose value will be added to req
        // using https://www.npmjs.com/package/express-flash-2 docs, but installed express-flash
        req.flash('registerMsg', `Thanks for signing up, ${user.first_name}!`);
        // Redirect kicks off a new request and makes the route in the URL match the location we have sent the user to. That's why we have to create a flash message so it will persist through the new request of the welcome route
        res.redirect('/next-lift');
      });
    })(req, res, next);
  } else {
    res.render('auth', { message: 'Password & password confirmation do not match' })
  }
};

// logging in existing users
module.exports.displayLogin = (req, res, next) => {
  res.render('auth');
};

module.exports.login = (req, res, next) => {
  console.log("here ready to log in");
  // Note we're using different strategy, this time for logging in
  passport.authenticate('local-signin', (err, user, msgObj) => {
    if (err) {  console.log(err) } //or return next(err) once handler set up in app.js
    if (!user) {
      console.log("no user YYY");
      return res.render('login', msgObj)
    }

    req.logIn(user, err => {
      if (err) { return next(err) }
      req.flash('welcomeBackMsg',`Welcome back, `);
      res.redirect('/next-lift');
    });
  })(req, res, next);
};

module.exports.welcome = (req, res, next) => {
  res.render('welcome');
};

// logging out
module.exports.logout = (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};
