var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "For good girls and bois who want to lounge out and get some good scritches and pats. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Meesa! Meesa! Meesa Jar Jar Binks! Burn the men in their stone houses! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Husky Village", 
        image: "https://d1wmhwtkksj55o.cloudfront.net/wp-content/uploads/2015/01/husky-dog-in-front-of-a-tent-camping.jpg",
        description: "This is the perfect place for good girls and bois to romp freely and make friends. There are plenty of scritches and pats for all. If a husko is lucky, she'll find a good groundhog to chase! 13/10 recommend. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Coastal Cucu Camp", 
        image: "https://campone.com/wp-content/uploads/2017/12/FB_IMG_1537891494422.jpg",
        description: "Private retreat on the Nova Scotian shoreline. Do you want to see my cucu? Ft. Cynthia Lee Fontaine. This is the perfect place for good girls and bois to romp freely and make friends. There are plenty of scritches and pats for all. If a husko is lucky, she'll find a good groundhog to chase! 13/10 recommend. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){console.log(err);}
        console.log("Removed campgrounds from db.");
        Comment.remove({}, function(err) {
            if(err){console.log(err);}
            console.log("Removed comments from db.");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){console.log(err);
                    } else {
                        console.log("Added a campground to db.");
                        //create a comment
                        Comment.create({
                            text: "This place is great! So many doggos!",
                            author: "Davy Wavy"
                        }, function(err, comment){
                            if(err){console.log("Error in seeding db: "+ err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment in db.");}
                        });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedDB;