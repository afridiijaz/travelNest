const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); // listing schema defined 
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js"); 
const upload = multer({storage})




router.route("/")
  .get(wrapAsync(listingController.index)) //index Route, show all lists in a card shape
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));//Create Route
  

// New Route this Route create new list which renders new form 
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id") 
  .get(wrapAsync(listingController.showListing)) // show route
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing , wrapAsync(listingController.updateListing)) //update route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));// Delete Route


// requesting for edit page
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


 module.exports = router;