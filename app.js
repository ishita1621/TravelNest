if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const port=8080;
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/expressError.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/TravelNest");
}

const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use( express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));

const sessionOptions={ 
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7, //cookie expires in 7 days
        maxAge:1000*60*60*24*7, //cookie max age is 7 days
        httpOnly:true, //cookie cannot be accessed by client side scripts
    }
}

// //root route
// app.get('/',(req,res)=>{
//     res.send('root route');
// })

app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //user should use each page of website after login
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{   //middleware to set flash messages in res.locals so that they can be accessed in all templates
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
});



app.use("/listings",listingRouter); //using listing routes
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,'Page Not Found'));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message='Something went wrong!'}=err;
    res.status(statusCode).render('error.ejs',{message});
    // res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log(`Server is runnning on port ${port}`);
})