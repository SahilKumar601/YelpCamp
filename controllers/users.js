const User = require('../models/user.js');

module.exports.renderRegisterForm=(req,res)=>{
    res.render('user/register.ejs');
}
module.exports.registerUser=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email})
        const registeruser=await User.register(user,password);
        req.login(registeruser,err=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome To YelpCamp')
            res.redirect('/campgrounds')
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render('user/login.ejs')
}
module.exports.loginUser=(req,res)=>{
    req.flash('success',`Welcome Back!!! ${req.user.username}`)
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}
module.exports.logoutUser=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','See you Soon!!!')
        res.redirect('./campgrounds')
    })
}