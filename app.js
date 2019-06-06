var express        = require("express"), 
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    app            = express(),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

// Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "Rusty is good",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*Campground.create({
    name: "Granite Hill", 
    image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
    description: "This is a huge granite hill, no bathrooms and no water. Beautiful hill"
}, function(err, campground){
    if(err){
        console.log(err);
    } else {
        console.log("Newly created campground!");
        console.log(campground);
    }
});*/

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
