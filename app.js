if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); // To support PUT/DELETE in HTML forms
const ejsMate = require("ejs-mate"); // EJS layout engine for reusable templates
const ExpressError = require("./utils/ExpressError.js"); // Custom error class

const session = require("express-session");

const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");

// 📡 MongoDB connection
const mong_url = "mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

// 🔧 App Configuration
app.engine("ejs", ejsMate); // Use ejs-mate to enable layouts and partials
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Define views directory

// 🛠 Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse incoming form data
app.use(methodOverride("_method")); // Override method using query ?_method=
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS

const store=MongoStore.create({ 
  mongoUrl:dburl,
  crypto:{
    secret:process.env.secret
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

// /* under this related signup/login/logout for more refer the user.js
app.use(passport.initialize());//Sets up Passport so your app can use authentication.
app.use(passport.session())	//Enables login sessions (keeps users logged in between requests).
passport.use(new LocalStrategy(User.authenticate()))//Tells Passport how to check if a username and password are correct.

passport.serializeUser(User.serializeUser()); //	Saves user info in the session when they log in (usually just the user ID)
passport.deserializeUser(User.deserializeUser());//Gets full user details from the session info for every request
// */

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");  
  res.locals.currUser=req.user;//to the navbar.ejs
  next();
});


app.use("/listings",listingRouter)
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

// ❌ Catch-all route for undefined paths
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found,Please try again later"));
});

// 🧱 Central error-handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  // res.status(status).send(message); // Could also render a custom error.ejs page
  res.render("error.ejs",{message})
});

// // 🏠 Root route
// app.get("/", (req, res) => {
//   res.send("working fine");
// });

// 🚀 Server listener
app.listen(8080, () => {
  console.log("Listening to the server on port 8080");
});
