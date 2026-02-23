const Listing=require("../models/listing")
const Review=require("../models/review")

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id); //finding listing to which review is to be added
    let newReview=new Review(req.body.review); //creating new review using data from form
    newReview.author=req.user._id;
    listing.reviews.push(newReview); //pushing new review to reviews array of listing

    await newReview.save(); //saving review to get its id and save it in listing's reviews array
    await listing.save(); //saving listing to update reviews array in db
    req.flash('success','Successfully created a new review!');
    res.redirect(`/listings/${listing._id}`); //redirecting to show page of listing to see the new review
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //pulling review id from reviews array of listing
    await Review.findByIdAndDelete(reviewId); //deleting review from reviews collection
    req.flash('success','Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}