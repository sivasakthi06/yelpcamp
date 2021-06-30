const {campgroundSchema,reviewSchema} = require('./schemas.js');//JOI schema
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
       //its help to see and make changes 1st we login using passport method isAuthenticated
   if(!req.isAuthenticated()) {    
      // console.log(req.path,req.originalUrl);
      //to get return to behaviour ,to add a session var to store url,user where to go before login
      req.session.returnTo =  req.originalUrl
    req.flash('error','You must be siged in first');
   return res.redirect('/login');
}
next();
}

//campground middleware  
module.exports.validateCampground=(req,res,next)=>{

   const { error } = campgroundSchema.validate(req.body);
   if(error){
       const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
   }
   else{
       next();
   }
   //console.log(error)
   }

   //isAuthor middleware to authentication check,its for campground routes
module.exports.isAuthor = async(req,res,next)=>{
       const { id } = req.params;
       const campground = await Campground.findById(id);
           if(!campground.author.equals(req.user._id)){
           req.flash('error','You do not have permission to edit')
           return res.redirect(`/campground/${id}`)
          
       }
       next();
   }
   //isauthor for review routes
   module.exports.isReviewAuthor = async(req,res,next)=>{
      const { id,reviewId } = req.params;
      const review = await Review.findById(reviewId);
          if(!review.author.equals(req.user._id)){
          req.flash('error','You do not have permission to edit')
          return res.redirect(`/campground/${id}`)
         
      }
      next();
  }

   
//middleware for review
module.exports.validateReview=(req,res,next)=>{

   const { error } = reviewSchema.validate(req.body);
   if(error){
       const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
   }
   else{
       next();
   }
   
}
