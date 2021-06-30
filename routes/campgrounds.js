const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground'); 
const campgrounds = require('../controllers/campgrounds');
//multer multipart/farm-data moongoose middleware to access bulk data
const multer = require('multer');
const { storage } = require('../cloudinary');
//to access cloudinary file storage and we not worry to represent the index.js file
//node is automatically get index files
const upload = multer({ storage });
//const upload = multer({ dest : 'uploads/'}) //its used to store the file in given location

const { isLoggedIn,isAuthor,validateCampground } = require('../middleware');// middleware



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))
  //here upload multer middlewarre run 1st bcoz adding data to req.body,validatecampground were depends on req.body
  
    /*  .post(upload.array('image'), (req,res)=>{
       //single to array =>multiple files upload
       //if we use multiple files to add we use plural form to mention "file" to "files"
    console.log(req.body,req.files);
    res.send('its worked')
   }) */

//add a new item (post method form)
router.get('/new',isLoggedIn,campgrounds.renderNewForm);
    

router.route('/:id')
//each shows seperately
.get(catchAsync(campgrounds.showCampground))
//edit put
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
//delete
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

//edit
router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))



module.exports = router;

