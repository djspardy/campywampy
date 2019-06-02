var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User = require("./models/user"),
    seedDB      = require("./seeds");
    

seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//
app.use(require("express-session")({
    secret: "huskies are the best breed of dog there is no question about that",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


// langind

app.get("/", function(req, res){
    res.render("landing");
});


// INDEX
app.get('/campgrounds', function(req, res){
    console.log(req.user);
    //Get campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){console.log("/campgrounds: Could not find campground(s). Error: " + err);
        } else{
            console.log("/campgrounds: Found " + campgrounds.length + " campgrounds in db.");
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});


// NEW
app.get("/campgrounds/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// CREATE
app.post("/campgrounds", isLoggedIn, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var newCampground = {name: name, image: image, description: description};
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds"); //default is to redirect as a GET req
       }
   });
//   campgrounds.push(newCampground);
});

// SHOW
app.get("/campgrounds/:id", function(req,res){
    // find campground (with comment ids, not comment author/text). Then populate those campgrounds with comments. Then execute the query.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){console.log(err);}else{
            console.log("Found campground by id = " + req.params.id);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ========================
// NEW COMMENT
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Error finding campground by Id: "+ err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
    
});

// CREATE COMMENT
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Error finding campground by Id: "+ err);
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("Error creating comment: "+err)
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log(campground);
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});


// ========================
// AUTH ROUTES

// Register

app.get('/register', function(req, res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("Error creating user:"+err);
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});


// Login

app.get('/login', function(req, res){
    res.render("login");
});

app.post('/login', passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    console.log("Login post route complete.");
});

// Logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}


// SERVER LISTEN

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server started!");
});