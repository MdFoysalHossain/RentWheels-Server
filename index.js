require('dotenv').config()
const express = require("express")

const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000


const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@rentwheels-cluster.6k50upv.mongodb.net/?appName=RentWheels-Cluster`;


const app = express()

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get("/", (req, res) => {
  res.send("Server is Alive")
})


async function run() {

  try {
    await client.connect();

    const RentWheelsDB = client.db("RentWheels");
    const AllCarsPost = RentWheelsDB.collection("AllCarsPost");

    app.post("/AddCar", async(req, res) => {
      const data = req.body;
      const result = await AllCarsPost.insertOne(data)
      console.log(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port)