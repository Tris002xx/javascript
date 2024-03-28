const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const User = require("../models/userModel.js");
const { userModel } = require("../models/userModel.js");
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const GitHubStrategy = require("passport-github2").Strategy;
// passport.use(new GithubStrategy({
//   clientID: '3d50f3d05fe83577ea3e',
//   clientSecret: 'f8c1693dd344a9fc96d5944be417b09b95f605a2',
//   callbackURL: "http://localhost:3000/auth/github/callback"
// },
//   function(accessToken, refreshToken, profile, cb) {
//     return cb(null, profile);
//   }));


passport.use(new GitHubStrategy({
  clientID: '3d50f3d05fe83577ea3e',
  clientSecret: 'f8c1693dd344a9fc96d5944be417b09b95f605a2',
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));
passport.serializeUser(function (userOther, done) {
  done(null, userOther.login);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// const GithubStrategy = require("passport-github2").Strategy;
// passport.use(new GithubStrategy({
//   clientID: '3d50f3d05fe83577ea3e',
//   clientSecret: 'f8c1693dd344a9fc96d5944be417b09b95f605a2',
//   callbackURL: "http://localhost:3000/auth/github/callback",
//   scope: ['user:email']
// },
//   function(accessToken, refreshToken, profile, cb) {
//     const user = {
//       id: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       password: "password", // Consider using hashed password instead of plain text
//     };
  
//     userModel.findOne({ email: user.email }, function(err, existingUser) {
//       console.log(`something aslkdfja;sldkjfas;dlkfjads;lfjasd;lfkj ${existingUser}`)
//       if (err) {
//         return cb(err);
//       }
//       if (existingUser) {
//         return cb(null, existingUser);
//       }
//       userModel.create(user, function(err, newUser) {
//         if (err) {
//           return cb(err);
//         }
//         return cb(null, newUser);
//       });
//     });
//   }));

// passport.use(new GithubStrategy({
//   clientID: '3d50f3d05fe83577ea3e',  //  import client id from .env
//   clientSecret: 'f8c1693dd344a9fc96d5944be417b09b95f605a2', //import clientsecret .env
//   callbackURL: "http://localhost:3000/auth/github/callback"
//  },
//   function(accessToken, refreshToken, profile, done) {
//     const user = {
//           id: profile.id,
//           name: profile.displayName,
//           email: profile.emails,
//           password: "password",
//         };
//     done(null, user.id);
//  }
// ));

/*
We have to implement this or it won't work. 
Do dont type just user. It holds on to the older.
Doing user.id will hold on to the id of the user because the id never changes. 
will create req.user = user : will hold all important information about the user.
*/
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);
