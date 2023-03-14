require("dotenv").config()

process.on("uncaughtException", err=>{
    console.log(err.name, err.message)
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN...")
    process.exit(1)
})

const express = require('express');
const mongoose = require("mongoose")
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use((req,res,next)=>{
    next()
})

const AppError = require("./src/utils/appError")
const globalErrorControler = require("./src/controllers/globalErrorHandler")

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}
const tourRouter = require("./src/routes/tourRoutes")
const userRouter = require("./src/routes/userRoutes")
app.use('/tours', tourRouter);

app.use("/user", userRouter);

// If given route doesn't match with any routes in our app then this middleware will be executed
app.all("*", (req, res, next)=>{
    
    next(new AppError(`Cannot find the ${req.originalUrl} route on the server!`, 404));
})

// Global Error Handler
app.use(globalErrorControler)

mongoose.connect(process.env.DATABASE_LOCAL)

const server = app.listen(process.env.PORT, ()=>{
    console.log('Connected to DB and Listening...');
});

process.on("unhandledRejection", err=>{
    console.log(err.name, err.message)
    console.log("UNHANDLED REJECTION! SHUTTING DOWN....")
    server.close(()=>{
        process.exit(1)
    })
})