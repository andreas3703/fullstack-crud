const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

app.get("/", (req, res) => {
  res.send("Hello node js");
});

app.get("/blog", (req, res) => {
  res.send("Hello blog");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(req.body);
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id);
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//Update and delete
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    //cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any prodct with ID ${id}` });
    } else {
      const updatedProduct = await Product.findById(req.params.id);
      res.status(200).json(updatedProduct);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    //cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any prodct with ID ${id}` });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://admin:admin123@testapi.0v1eyan.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connect to mongodb");
    app.listen(3000, () => {
      console.log("Backend is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
