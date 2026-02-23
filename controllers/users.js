const User=require("../models/user")
module.exports.renderSignupForm=(req,res)=>{
    res.render('user/signup.ejs');
}

module.exports.signUp=async(req,res)=>{
    try{
        let {email,username,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully register!!Welcome to TravelNest");
        res.redirect('/listings'); 
    })
    }
    catch(e){
    req.flash("error",e.message);
    res.redirect('/signup');   
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('user/login.ejs');
}

module.exports.login=async (req,res)=>{
    req.flash("success","Successfully Login!!Welcome back to TravelNest");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you have been logout");
        res.redirect('/listings');
    });
}