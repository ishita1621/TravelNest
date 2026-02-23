const express=require('express');
const router=express.Router({mergeParams:true}); //to get access to params of parent route
const wrapAsync=require('../utils/wrapAysnc.js');
const {validateReview,isLoggedIn, isReviewAuthor}=require('../middleware.js')
const Review=require('../models/review.js');
const Listing=require('../models/listing.js');
const reviewController=require("../controllers/reviews.js")


//review route to add review to a listing
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route to delete a review from a listing
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;