const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
app.use(express.json());

//middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => {
  console.log('hello from the middlware');
  next();
});

app.use(morgan('dev'));

//route handlers

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
