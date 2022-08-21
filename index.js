const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

require("dotenv").config();

const cors = require("cors");

const app = express();
app.use(cors());
app.use(formidable());


mongoose.connect(process.env.MONGODB_URI);

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);


const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Route introuvable" });
  });

app.listen(process.env.PORT, () => {
  console.log("Served started");
});
