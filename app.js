const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");


const user = require("./routes/user");
const admin = require("./routes/admin");
const globalErrorHandler = require("./controller/error_controller");

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


const app = express();
const port = 8000
dotenv.config({path : `${__dirname}/config.env`})
app.use(express.json()) 


const DB = process.env.MONGO_URL.replace("<db_password>",process.env.MONGO_PASSWORD)
mongoose.connect(DB).then(() => {
  console.log("Database connected successfully")
})


app.use("/user", user)
app.use("/admin", admin)

app.all(/.*/, (req, res) => {
  res.statusCode(404).json({
    "error" : "Page Not Found"
  })
});

app.use(globalErrorHandler)

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


process.on("unhandledRejection", (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
})