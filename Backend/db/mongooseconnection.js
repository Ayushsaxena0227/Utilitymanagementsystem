const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ayushnamehemera123:S51EtXrlvCK6Lpus@cluster0.hzxwo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Connection error:", e));
