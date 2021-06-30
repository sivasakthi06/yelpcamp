//env is environment variable
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
    //its find a variable in a .env file and access it here/whereever you want
}
//to display only alerts not all errors for clients
//dont show errors outside of developer
//handling errors error.ejs file added process.env.Node_ENV if condition before err.stack
//require('dotenv').config();
//console.log(process.env.SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
//const Joi = require('joi');
//const {campgroundSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
//const catchAsync = require('./utils/catchAsync');  //errror handling 
const methodOverride = require('method-override');  //instaling for put method into use post method form
//const Campground = require('./models/campground');  //schema
//const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User =  require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);


//router for campground
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

//process.env.DB_URL;
//database creation
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false//to avoid deprecation warning in mongoose
});
//database connection
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",() => {
    console.log("DB OPEN");
}); 

const campground = require("./models/campground");
const review = require('./models/review');


const app = express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs'); //to use ejs
app.set('views',path.join(__dirname,'views')) //use views 

app.use(express.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
//access static assets
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith: '_'
} ))

const secret = process.env.SECRET || 'thisissecret';

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 
});

store.on("error", function(e){
    console,log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name : 'session',
    secret,
    //resave and saveuninitalized used to avoid session deprecated warning
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxage:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
//it automatically enables all 11 middlewares
app.use(helmet());
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
 /* app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );  */
 
  const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://icons.getbootstrap.com/icons",
    "https://img.icons8.com",
    "http://icons.getbootstrap.com/icons/",
    "https://icons.getbootstrap.com/icons/house-door/",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://icons.getbootstrap.com/icons",
    "https://img.icons8.com",
    "http://icons.getbootstrap.com/icons/",
    "https://icons.getbootstrap.com/icons/house-door/",
    "https://img.icons8.com/ios/100/000000/add-user-male.png",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/appinessyelpcamp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
/* const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdeliver.net",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://a.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives:{
            defaultSrc:[],
            connectSrc:["'self'",...connectSrcUrls],
            scriptSrc:["'unsafe-inline'","'self'",...scriptSrcUrls],
            styleSrc:["'self'","'unsafe-inline'",...styleSrcUrls],
            workerSrc:["'self'","'blob:'"],
            objectSrc:[],
            imgSrc:[
                "'self'",
                "'blob:'",
                "'data:'",
                "https:res.cloudinary.com/appinessyelpcamp/",
                "https://images.unsplash.com/",

            ],
            fontSrc: ["'self'",...fontSrcUrls],
        },
    })
);
 */


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
//these serialize deserialize used to how user stored in session automatically
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local middleware for flash
app.use((req,res,next)=>{
    //console.log(req.session);
    //to show mongo sanitize work
    //console.log(req.query);
    res.locals.currentUser = req.user;//current user login and logout to find
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req,res) => {
    const user= new User({email:'mas21@gmail.com',username:'mas21'});
    const newUser= await User.register(user,'appi'); //appi is password
    console.log(newUser);
    res.send(newUser);
})

//campground routes definition 
app.use('/campground',campgroundsRoutes);
app.use('/campground/:id/reviews',reviewsRoutes);
app.use('/',userRoutes);





app.get('/', (req,res) =>{
    res.render('home')
})




/* app.get('/makecampground', async(req,res) =>{
    const camp = new Campground({name:'garden',describtion:'popcorn'});
    await camp.save();
    res.send(camp)
}) */





//error handling
/* app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
}) */
 
app.use((err,req,res,next)=>{
    const { status=500} = err;
    //res.status(statusCode).send(message);
    if(!err.message) err.message = 'oh no!Wrong';
    //console.log(err.message)
    res.status(status).render('error',{ err });
    
}) 
/* app.use(function (err, req, res, next) {
    const { status = 500 } = err;
    if (!err.message) err.message = "OPPS! Something Went Wrong :("
    res.status(status).render('error', { err })
}) */

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Serving on port ${port}`)
})