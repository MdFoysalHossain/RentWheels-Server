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

    app.post("/AddCar", async (req, res) => {
      const data = req.body;
      const result = await AllCarsPost.insertOne(data)
      console.log(result)
    })

    app.get("/BrowseCars", async (req, res) => {
      const cursor = AllCarsPost.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get(`/BrowseCars/:id`, async (req, res) => {
      const params = req.params.id;
      console.log(params)
      const query = { _id: new ObjectId(params) }
      const result = await AllCarsPost.findOne(query)
      console.log(result)
      res.send(result)
    })


    app.patch(`/BrowseCars/:id`, async (req, res) => {
      const params = req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(params) };
      const update = { $set: { status: updateInfo.status, bookedBy: updateInfo.bookedBy } }
      const result = await AllCarsPost.updateOne(query, update)
      console.log(result)
      res.send(result)

    })



    app.get("/MyListings", async (req, res) => {
      const query = req.query.email
      const check = { email: query }
      const cursor = AllCarsPost.find(check)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.delete("/MyListings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await AllCarsPost.deleteOne(query)
      console.log("Deleted:", result)
      res.send(result)
    })


    // Book Car Patch
    app.patch("/MyListings/:id", async (req, res) => {
      const params = req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(params) };
      const update = { $set: { status: updateInfo.status, bookedBy: updateInfo.bookedBy } }
      const result = await AllCarsPost.updateOne(query, update)
      console.log("Updated:", result)

      res.send(result)

    })

    // Patch My Listing
    app.patch("/MyListingsUpdate/:id", async (req, res) => {
      const params = req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(params) };
      const update = {
        $set: {
          carName: updateInfo.carName,
          description: updateInfo.description,
          category: updateInfo.category,
          rentPrice: updateInfo.rentPrice,
          location: updateInfo.location,
          imageUrl: updateInfo.imageUrl,
          email: updateInfo.email,
          name: updateInfo.name,
        }
      }
      const result = await AllCarsPost.updateOne(query, update)
      console.log("Updated:", updateInfo)
      res.send(result)

    })




    // Get My Bookings
    app.get("/MyBookings", async(req, res) => {
      const email = req.query.email;
      const query = {bookedBy: email}
      const cursor = AllCarsPost.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    // Remove my booking
    app.patch("/MyBookings/:id", async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const update = { 
        $set: {
          bookedBy: "",
          status: "Available"
      }}

      const result = await AllCarsPost.updateOne(query, update)
      console.log("Removed Booking:", result)
      res.send(result)
    })




    app.get("/NewestCars", async(req, res) => {
      const data =  AllCarsPost.find().sort({ createdAt: -1 });
      const result = await data.toArray()
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