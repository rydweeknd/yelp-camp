var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - Show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   // Get data from form
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   // Create a new campground and save to DB
   var newCampground = {name: name, image: image, description: description, author: author, price: price};
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
            console.log(err);
       } else {
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
       }
   });
});

// NEW - Show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - Show info about a campground
router.get("/campgrounds/:id", function(req, res) {
    // Find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            // Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});    
    });
});

// UPDATE Route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find & Update Crt campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           console.log(err);
       } else {
           // Redirect Show page
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DELETE Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   }); 
});

module.exports = router;