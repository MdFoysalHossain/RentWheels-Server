require('dotenv').config()
const express = require("express")

const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get("/BrowseCars", async(req, res) => {
      const cursor = AllCarsPost.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get(`/BrowseCars/:id`, async(req, res) => {
      const params = req.params.id;
      console.log(params)
      const query = {_id: new ObjectId(params)}
      const result = await AllCarsPost.findOne(query)
      console.log(result)
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port)