const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();


const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.lz5tib6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server

    const addTaskCollection = client.db("ToDoList").collection("AddTask");

    app.post("/AddTask", async (req, res) => {
      const member = req.body;
      const result = await addTaskCollection.insertOne(member);
      res.send(result);
    });

    app.get("/AllTask", async (req, res) => {
      // const email = req.query.email;
      const result = await addTaskCollection.find().toArray();

      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/AddTask/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          isPending: true,
        },
      };
      const result = await addTaskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the Asset management");
});
app.listen(port, () => {
  console.log(`Asset management is running port  ${port}`);
});
