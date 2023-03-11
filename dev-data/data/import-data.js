require("dotenv").config()
const express = require("express")
const fs = require("fs")
const app = express()

const mongoose = require("mongoose") 
const morgan = require('morgan');
app.use(express.json());
app.use((req, res, next)=>{
  next()
})

const Tour = require("../../src/model/tourModel")

if(process.env.NODE_ENV==="development"){
  app.use(morgan('dev'));
}
const tourRouter = require("../../src/routes/tourRoutes")
app.use('/tours', tourRouter);

mongoose.connect("mongodb://localhost:27017/tourapp")
.then(()=>{
  app.listen(process.env.PORT, () => {
    console.log('Connected to DB and Listening...');
  });
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`))

const importData = async () =>{
    try {
        await Tour.create(tours)
        console.log("Data Successfully added")
        process.exit(1)
    } catch (error) {
        console.log(error)
    }
}

importData()
