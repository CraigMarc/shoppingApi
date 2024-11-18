const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const passport = require("passport");
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

const productRouter = require('./routes/products')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customerRouter = require('./routes/customers');

const User = require("./models/user");

const app = express();

/* restrict access later ***********
app.use(
  cors({
    origin: ["https://blog-public-two.vercel.app", "https://blog-user-beta.vercel.app"],
    credentials: true,
  })
);*/


app.use(cors());

//added auth route


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY; //normally store this in process.env.secret
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT')

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  
  try {
  let userDb = User.findOne({userName: jwt_payload.email})
    
    if (userDb) {
        return done(null, true);
    } else {
        return done(null, false);
        
    }
  }
  catch (error) {
    console.log(error)
  }
}))

// connect database

const mongoDB = process.env.MONGODB_URI 

main().catch((err) => console.log(err));
async function main() {
await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customer', customerRouter);
app.use('/products', passport.authenticate('jwt', {session: false}), productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;