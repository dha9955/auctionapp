const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("socket.io");
var http = require("http").createServer(app);
var io = socket(http);
http.listen(2001);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});



//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const manageUserRoutes = require("./routes/admin/user");
const productRoutes = require("./routes/product");
const auctionRoutes = require("./routes/auction");
const userRoutes = require("./routes/user");
const ratingRoutes = require("./routes/rating");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
//environment variable
env.config();

// mongodb connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.jpp3r.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("connected to mongoDB"))
  .catch((error) => console.error(`cant connect to db ${error}`));

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", productRoutes);
app.use("/api", auctionRoutes);
app.use("/api", userRoutes);
app.use("/api", manageUserRoutes);
app.use("/api", ratingRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);



io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join bidding", (data) => {
    socket.join(data.productId);
    console.log(data);
    console.log(socket.id);
  });

  socket.on("auction", (data) => {
    socket.to(data.room).emit("complete auction");
  });
});


