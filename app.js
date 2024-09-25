// if(process.env.NODE_ENV !== "production"){
// }
// console.log(process.env)
require('dotenv').config();


const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port=9090;




// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // database path in my local machine
   const dbUrl = process.env.ATLASDB_URL;
 




main().then(()=>{
    console.log('connected to DB ');
}).catch((err)=>{
    console.log(err);
})

//main function for connection of mongoDB
async function main(){
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs"); //setting view engine 
app.set("views",path.join(__dirname,"views/listings")); //setting of ejs views/listings


app.use(express.urlencoded( {extended: true} ))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log("Error in mongo session store ",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}



// creating session
app.use(session(sessionOptions))
app.use(flash()) // using flash messages

app.use(passport.initialize());
app.use(passport.session()); // creating session if user visit to the site from different tag
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // save user information
passport.deserializeUser(User.deserializeUser()); // remove user information


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

/*
app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email:"khan3@gmail.com",
        username: "abcd"
    });
   let registeredUser = await User.register(fakeUser,"abc890");
   res.send(registeredUser);
}) */
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);
app.use("https://travelnest-6zeq.onrender.com/",listingRouter)

//page not found error message
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})



app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message);

})
app.listen(port,()=>{
    console.log(`Server is running on port no ${port}`);
})