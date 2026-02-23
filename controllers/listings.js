const Listing=require("../models/listing")
module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
       res.render("listings/index.ejs",{ allListings }); 
};

module.exports.renderNewForm=(req,res)=>{
    res.render('listings/new.ejs');
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:"author",
        },
    })
    .populate('owner'); //populating reviews to show them in show page
    if(!listing){
        req.flash('error','Cannot find that listing!');
        res.redirect('/listings');
    }
    console.log(listing);
    res.render('listings/show.ejs',{listing});
}

module.exports.createListing= async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('success','Successfully created a new listing!'); //flash message to show success message after creating a new listing
    res.redirect('/listings');
    
    // let{title,description,price,location,country}=req.body; to avoid this we can write in this way and make 
    //changes in new.ejs also
    
}

module.exports.renderEditForm=async(req,res)=>{
   let {id}=req.params;
    const listing=await Listing.findById(id); 
    if(!listing){
        req.flash('error','Cannot find that listing!');
        res.redirect('/listings');
    }
    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload/","/upload/w_250/");
    res.render('listings/edit.ejs',{listing,originalImgUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); //destructuring to avoid writing all fields
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash('success','Successfully updated the listing!');
    res.redirect('/listings');
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success','Successfully deleted the listing!');
    res.redirect('/listings');
}