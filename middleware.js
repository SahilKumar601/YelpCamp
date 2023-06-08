module.exports.isLoggedIn =(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl;
        req.flash('error','Please Login First');
        return res.redirect('/login')
    }
    next();
}
module.exports.storeReturnTo =(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}