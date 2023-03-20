require("dotenv").config()
const express = require("express")
const fs = require("fs")
const app = express()

const mongoose = require("mongoose") 

const Tour = require("../../src/model/tourModel")
const User = require("../../src/model/userModel")
const Review = require("../../src/model/reviewModel")


mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
  app.listen(4000, () => {
    console.log('Connected to DB and Listening...');
  });
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`))

const importData = async () =>{
    try {
        await Tour.create(tours)
        await User.create(users, { validateBeforeSave: false })
        await Review.create(reviews)
        console.log("Data Successfully added")
        process.exit(1)
    } catch (error) {
        console.log(error)
    }
}

const deleteData = async () =>{
  try {
      await Tour.deleteMany()
      await User.deleteMany()
      await Review.deleteMany()
      console.log("Data Successfully deleted")
      process.exit(1)
  } catch (error) {
      console.log(error)
  }
}

if(process.argv[2]==="--import"){
  importData()
}
else if(process.argv[2]==="--delete"){
  deleteData()
}
