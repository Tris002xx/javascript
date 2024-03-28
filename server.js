const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const port = process.env.port || 3000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/login', function(req, res){
  res.render('login', { user: req.user });
});




app.get('/auth/github', 
  passport.authenticate('github', { user: [ 'user:req.session.username' ] }),
  function(req, res) {
    res.redirect('/dashboard');
  });
app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: 'auth/login' }),
  function(req, res) {
    console.log("HI")
    // req.session.username = req.user.username;
    // req.session.displayname = req.user.displayName;
    res.redirect('/dashboard');
});

app.get('/dashboard', function(req, res){
  if (req.user.username == null) {
    res.redirect('/dashboard1');
  } else 
  res.render('dashboard', { user: { name: req.user.displayName } });
});









app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.session.username);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});



app.use("/", indexRoute);
app.use("/auth", authRoute);
// if the page starts with /auth, it will go to authRoute which is login

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
