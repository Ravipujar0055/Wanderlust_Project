const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listSchema } = require("./schemvali.js");
const {reviewschema} =require("./schemvali.js");// in curly brace only property are exported but in simple whole object gets exported
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      //if the user wants redirect to original path if he access the path without logging in
    req.session.redirectUrl=req.originalUrl;//get the path 
    req.flash("error","You Are Not Logged In!");
    return res.redirect("/login");
  }
  next();
}
//by use of res.locals its get caught by the line code where it is defined as res.locals.redirectUrl
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

//middleware for aothorisation for edit ,delete,update of the listing
module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You Dont Have Permission To EDIT")
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Schema validation using Joi, now validates req.body
module.exports.validateListing = (req, res, next) => {
  let { error } = listSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg); // 400 is better than 404 for validation error
  } else {
    next();
  }
};

//schema validation for review from server side
module.exports.validatereview=((req,res,next)=>{
  let {error} = reviewschema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,errmsg);
  }else{
    next();
  }
})
//is review author
module.exports.isreviauthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You Are Not The Author")
    return res.redirect(`/listings/${id}`);
  }
  next();
};
