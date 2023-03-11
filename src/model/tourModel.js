const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim:true
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    maxGroupSize:{
      type: Number,
      required: [true, "Duration is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discountedPrice:{
      type:Number
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity:{
      type: Number,
      default:0
    },
    summary:{
      type:String,
      required:[true,"Summary is required"],
      trim:true
    },
    difficulty:{
      type:String,
      required:[true, "Difficulty is required"],
      trim:true
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true, "Cover image is required"],
      trim:true
    },
    images:[String],
    startDates:[Date],
    secretTour:{
      type:String,
      default:false
    }
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  },
  {
    timestamps: true,
  }
);

tourSchema.virtual("durationWeeks").get(function(){
  return this.duration/7
})

// Query Middleware
tourSchema.pre(/^find/, function(next){
  this.find({secretTour:{$ne:true}})
  next() 
})

tourSchema.post(/^find/, function(docs, next){
  console.log
  next() 
})

// Aggregate Middleware

tourSchema.pre("aggregate", function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
  console.log(this.pipeline())
  next()
})

module.exports = mongoose.model("tours", tourSchema);
