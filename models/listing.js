const mongoose=require('mongoose');
const Review = require('./review');
const { ref } = require('joi');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,   
     },
     reviews:[    //to store array of reviews for each listing
        {
            type:Schema.Types.ObjectId, //to store reference of review in listing
            ref:'Review' //to tell mongoose that this is reference of review model
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

listingSchema.post('findOneAndDelete',async(listing)=>{ //middleware to delete all reviews of a listing when listing is deleted
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});



const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;