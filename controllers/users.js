const User=require("../models/user");

module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupnewuser=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newuser=new User({username,email});
    let registeredUser =await User.register(newuser,password);
    ///*when new user singup it will automatically make them logged in
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
    req.flash("success","Welcome To WanderLust");
    res.redirect("/listings");        
    })
    //*/

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//
module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.redirectourl=(req, res) => {
    req.flash("success","Welcome to Wanderlust")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl); // or wherever you want after login
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
    if(err){
        return next(err);           
    }
    req.flash("success","Logout Successful!");
    res.redirect("/listings");
    });
}