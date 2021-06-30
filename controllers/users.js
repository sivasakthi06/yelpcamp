const User = require('../models/user');

//register modules
module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}

module.exports.register = async(req,res,next)=>{
    try{const{ email,username,password } = req.body;
    const user = new User({email,username});
    const registerUser = await User.register(user,password);
    //console.log(registerUser);
    //fixing register route "login" used to automatically registered user can login to the page.
    //passport.authenticate helps to req.login to sing up automatically
    req.login(registerUser,err =>{
        if(err) return next(err);
        req.flash('success','welcome to yelpcamp');
        res.redirect('/campground');
    })
}catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
}
}

//login modules
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.login = (req,res)=>{
    req.flash('success','welcomeback');
    //this will get if you have clicked the urls session.returnto work otherwise its a normal "login" route "campground" work.because we were in login route
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success','GoodBye');
    res.redirect('/campground');
}