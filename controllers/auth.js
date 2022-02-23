const User = require('../models/user');
const bcrypt = require('bcryptjs');
const user = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  console.log(password)
  User.findOne({email:email})
  .then(user => {
    if (!user) {
      req.flash('error', 'Invalid email or password.')
      return res.redirect('/login')
    }
    console.log(user.password)
    bcrypt.compare(password, user.password)
  .then(doMatch => {
    console.log(doMatch)
    if(doMatch)
    {
      req.session.isLoggedIn = true
      req.session.user = user
      return req.session.save(err => {
        console.log(err)
        res.redirect('/')
      })
    }
    res.redirect('/login')
  }) 
  .catch(err => console.log(err));
})
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({email:email})
  .then(userDoc => {
    if (userDoc) {
      req.flash('error', 'This email is already in use.')
      return res.redirect('/signup')
    }
    else if (password !== confirmPassword) {
      req.flash('error', 'Password does not match.')
      return res.redirect('/signup')
    }
    return bcrypt
    .hash(password,12)
    .then((hashedPassword) => {
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: {items: []}
    })
    return user.save()
  })
    .then((result) => {
      res.redirect('/login')
    })
  }).
  catch(err => {
    console.log(err)
    res.redirect('/')
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
  })
  // req.flash('error', 'Password does not match.')
  res.redirect('/');
};
