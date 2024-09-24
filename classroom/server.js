const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path  = require("path");
console.log(" i am inside server js file ")
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash())
app.set("view engine","ejs"); //setting view engine 
app.set("views",path.join(__dirname,"views/listings")); //setting path of ejs 
app.get("/",(req,res)=>{

    res.send(" I am  in  home page");
})
app.get("/test",(req,res)=>{
    res.send("test successful")
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count)
      req.session.count++;
    else 
    req.session.count =1;
    res.send(`You have visited ${req.session.count} time`)
})

app.get("/register",(req,res)=>{
    let{name = "unknown"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    req.flash("success","user registered succesfully"); 
    res.render('page.ejs',{name: req.session.name});
})

app.get("/hello",(req,res)=>{
    res.send(`hello,  ${req.session.name}`);
})
// app.get("/users",(req,res)=>{
//     res.send("Get for users");
// })

// app.post("/users",(req,res)=>{
//     res.send("Post for uses");
// })



app.listen(3000,()=>{
    console.log("server is listing on prot 3000");
})