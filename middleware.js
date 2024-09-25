const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js")


module.exports.isLoggedIn = (req,res,next)=>{
   
    if(!req.isAuthenticated()){
       // console.log(req.path ," .. ",req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in for creating listings");
    return  res.redirect("/user/login")
 }

 next();
}



// store the current route path 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// checking if the user is already  logged out
module.exports.isLoggedOut = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("success","you are already logged out");
      return  res.redirect("/listings");
    }
    next();
}


//check if the user if the owner of the list or not
module.exports.isOwner = async (req,res,next)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id); 
    // if(!(listing && listing.owner && listing.owner._id.equals(res.locals.currUser._id))){
    //     req.flash("error","You are not allowed to perform any operation as you are not the owner!");
    //     return res.redirect(`/listings/${id}`);
    // }else {
    //     next()
    // }

 if(!listing.owner._id.equals(res.locals.currUser._id)){
    
        req.flash("error","You are not allowed to perform any operation as you are not the owner!");
        return res.redirect(`/listings/${id}`);
      } 
      
      next();
}


// validate the listing  
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else {
        next();
    }
}


// validate the review 
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else {
        next();
    }
}



module.exports.isReviewAuthor = async (req,res,next)=>{
    let{id,reviewId}=req.params;
      const review = await Review.findById(reviewId); 
      if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You can not delete the review as you are not the author !");
        return res.redirect(`/listings/${id}`);
      }
      next();
}