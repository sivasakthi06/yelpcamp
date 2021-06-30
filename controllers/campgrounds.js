const Campground = require('../models/campground'); 
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

//index page of campgrounds
module.exports.index = async(req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
}

//new campground
module.exports.renderNewForm = (req,res)=>{
    res.render('campground/new')
}

module.exports.createCampground = async(req,res,next)=>{      //handling error
    // if(!req.body.campground) throw new ExpressError('Invalid campground',400);
       //flash msg

       const geoData = await geocoder.forwardGeocode({
           query : req.body.campground.location,
           limit : 1
       }).send()
      
      //res.send('ok')
   const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f=>({url: f.path, filename: f.filename }));
    //req.files to access with the help of multer
    //path and filenames are cloudinary storage variable.url and filename are keys for images
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    //console.log(req.user._id);
    //if we crerate a new campground that user details were saved as a author
    //which user create that campground he will be in-charge
         await campground.save();
         console.log(campground);
         req.flash('success','Successfully made a new campground') 
         //console.log(campground);
         res.redirect(`/campground/${campground._id}`)  
        
 }

 //show campground
 //16jun handling error added 'next' and CatchAsync 
//populate used to add other schema model values as a object to stored in 'author' and 'reviews'
 module.exports.showCampground = async(req,res,next) =>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate : {
            path : 'author'  //reviews author getting used nested populate
        }
    }).populate('author');
    //console.log(campground);
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.redirect('/campground');
    }
     res.render('campground/show',{campground});
    // res.render('campgrounds/show')
     
   /*   catch(err){
         next(new ExpressError('file new not found',402))
     } */
 }

 module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params;   
    const campground = await Campground.findById(id);
        if(!campground){
            req.flash('error','Cannot find/edit campground')
            return res.redirect('/campground');
        }
 //********************************************** */
    //this code to check un authorized user can't edit through entering edit in url/postman method
    //and also it goes to edit page once update button click it shows error
       //copied ;-) from put.//  const campground= await Campground.findById(id)
       /*  if(!campground.author.equals(req.user._id)){
            req.flash('error','You do not have permission to edit')
            return res.redirect(`/campground/${id}`)
           
        } */
//******************************************* */

    res.render('campground/edit',{campground});
    
}

//updating
module.exports.updateCampground = async(req,res)=>{
    const { id } = req.params;
   // console.log(req.body);
    //********************************************** */
    //this code to check un authorized user can't edit through entering edit in url/postman method
    //and also it goes to edit page once update button click it shows error
  /*   const campground= await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to edit')
        return res.redirect(`/campground/${id}`)
        //here we want to return value otherwise its updated 
    } */
    //************************************************** */
    //if we use above code we change the campground name as camp
    //otherwisw its shows error like already had a name of campground
    const campground= await Campground.findByIdAndUpdate(id,{ ...req.body.campground});
    //the below line to add cloudinary using multer
    //we using to store array in variable and spread to store campground.images
    //bcoz array push by object .we want it in same array
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    //to delete background of images stored in cloudinary and mongodb
    if(req.body.deleteImages){
        //below code to delete images from cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        //below code used to delete images from mongoDB
       await campground.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
       console.log(campground)
    }

    req.flash('success','Successfully updated campground') 
    res.redirect(`/campground/${campground._id}`)
}
//deleteing
module.exports.deleteCampground = async(req,res)=> {
    const {id} = req.params; 
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted') 
    res.redirect('/campground');

}