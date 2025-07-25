const Listing=require("../models/listing.js");

//index form
module.exports.index = async (req, res) => {
  const allistings = await Listing.find({});
  res.render("./listings/index.ejs", { allistings });
}

//new form
module.exports.newform=(req, res) => {
  res.render("./listings/createOne.ejs");
}
//edit form
module.exports.editform=async (req, res) => {
  let { id } = req.params;
  let olist = await Listing.findById(id);
  if (!olist) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }
  let originalImageUrl=olist.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_250")
  res.render("./listings/edit.ejs", { olist,originalImageUrl });
}

//update form
module.exports.updatelisting=async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
  
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }

  req.flash("success", "Listing Updated!") 
  res.redirect(`/listings/${id}`);
}

//delete listing
module.exports.deletelisting=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings");
}
//new listing save page to database
module.exports.newlisting=async (req, res, next) => {
  const url=req.file.path;
  const filename=req.file.filename;
    let nlist = new Listing(req.body.listing);
    //adding the current logged user as the owner 
    nlist.owner=req.user._id;
    nlist.image={url,filename};
    await nlist.save();
    req.flash("success", "Listing Created!")
    res.redirect("/listings");
  }

//show single listing
module.exports.singlelisting=async (req, res) => {
  let { id } = req.params;
  const onelist = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!onelist){
    req.flash("error", "Listing Not Found!")
    return res.redirect("/listings");
  }   
  res.render("./listings/show.ejs", { onelist });
}
