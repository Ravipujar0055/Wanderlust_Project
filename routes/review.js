const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAysnc.js"); // Utility to handle async errors
// const { Console } = require("console");
const review=require("../models/review.js")
const Listing = require("../models/listing.js"); // Mongoose model for Listings
const {validatereview, isreviauthor, isLoggedIn}=require("../middleware.js");
const controllerreview=require("../controllers/reviews.js");
//post a review
router.post("/",isLoggedIn,validatereview,wrapAsync(controllerreview.postreview));

//delete the review OF the list
router.delete("/:reviewId",isLoggedIn,isreviauthor,wrapAsync(controllerreview.deletreview))
module.exports=router;