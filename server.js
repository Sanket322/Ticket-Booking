const mongoose = require("mongoose");
const dotenv = require("dotenv");



// If any synchronous code crashes before you load env or create the server then node should shut down
// that the reason this code is written in starting
// for ex: any dependency which is not installed
// or any wrong path import
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

// before require app we need to set config so that it can be used in app module's import
dotenv.config({path : `${__dirname}/.env`})

const app = require("./app");

const DB = process.env.MONGO_URL.replace("<db_password>",process.env.MONGO_PASSWORD)
mongoose.connect(DB).then(() => {
    console.log("Database connected successfully")
})

const port = 8000
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// This handler closes the server safely if any async code crashes.
process.on("unhandledRejection", (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
})