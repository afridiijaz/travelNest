
const path = require("path")
const User = require("../models/user");

module.exports.renderSignupForm  = (req,res)=>{
    const signUp = path.join(__dirname, '..', 'views', 'users', 'signup.ejs');
    res.render(signUp);
}

module.exports.signup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser =  new User({email,username});
        const registeredUser = await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) {
                return next(err)
            };
            req.flash("success","user was registered successfully ");
            res.redirect("/listings");
        });
        

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}


module.exports.renderLoginForm = (req,res)=>{
    const login = path.join(__dirname, '..', 'views', 'users', 'login.ejs');
    res.render(login);
   
}


module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to My website");
    
    let redirectUrl = res.locals.redirectUrl || "/listings"
    
    res.redirect(redirectUrl);

}


module.exports.logout = (req,res,next)=>{
       
    req.logout((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}