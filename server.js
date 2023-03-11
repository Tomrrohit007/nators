require("dotenv").config()

const express = require('express');
const mongoose = require("mongoose") 
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use((req, res, next)=>{
  next()
})

if(process.env.NODE_ENV==="development"){
  app.use(morgan('dev'));
}
const tourRouter = require("./src/routes/tourRoutes")
app.use('/tours', tourRouter);


mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
  app.listen(process.env.PORT, () => {
    console.log('Connected to DB and Listening...');
  });
})


