var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    passportLocalMongoose = require("passport-local-mongoose")
    

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();

app.set('view engine','ejs');

//any time we need to user a form and post request, we use this
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//======================
//Routes
//======================


app.get("/", function(req, res){
    res.render("home");
})

app.get("/secret", isLoggedIn, function(req,res){
    res.render("secret");
})

//Auth Routes
//Show sign up form

app.get("/register", function(req,res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req,res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if (err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/secret");
       });
   });
});

//log in routes
app.get("/login", function(req,res){
    res.render("login");
})

//render login form,middileware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
});

//logout

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//setting server up
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("server statred....");
})