const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAysnc.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const controllerlisting=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(controllerlisting.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(controllerlisting.newlisting));


// ➕ New listing form page
router.get("/new", isLoggedIn,(controllerlisting.newform));

router.route("/:id")
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(controllerlisting.updatelisting))
.get(wrapAsync(controllerlisting.singlelisting))
.delete(isLoggedIn,isOwner,wrapAsync(controllerlisting.deletelisting));


// ✏️ Edit form page
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(controllerlisting.editform));



module.exports = router;
