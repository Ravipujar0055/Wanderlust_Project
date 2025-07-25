const Listing=require("../models/listing");
const review=require("../models/review");
module.exports.postreview=async(req,res)=>{
  let list=await Listing.findById(req.params.id);
  let newreview=new review(req.body.review);

  newreview.author=req.user._id;
  list.reviews.push(newreview);

  await newreview.save();
  await list.save();
  req.flash("success", "Review Created!")
  res.redirect(`/listings/${list._id}`)
  // res.send("inserted succesfuly");
}
//delete the review
module.exports.deletreview=async(req,res)=>{
  let {id ,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!")
  res.redirect(`/listings/${id}`);
  
}