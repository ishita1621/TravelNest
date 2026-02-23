const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAysnc.js');
const Listing=require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const listingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require('../cloudConfig.js')
const upload=multer({storage})

router
 .route("/")
 .get(wrapAsync(listingController.index))//index route to show all listings
 .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
 ); //create route to add new listing to db


//new route to show form to create new listing
router.get('/new',isLoggedIn,listingController.renderNewForm)

router
 .route("/:id")
 .get(wrapAsync(listingController.showListing))//show route to show details of one listing
 .put(isLoggedIn,isOwner,upload.single("listing[image]"),
validateListing,wrapAsync(listingController.updateListing))//update route to update a listing in db
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//delete route to delete a listing from db

//edit route to show form to edit a listing
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
