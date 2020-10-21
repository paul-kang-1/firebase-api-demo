const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-demo-3b322.firebaseio.com",
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use(cors({ origin: true }));

//Routes
app.get("/hello-world/", (req, res) => {
  return res.status(200).send("Hello world!");
});

//Create
app.post("/api/create/", (req, res) => {
  (async () => {
    try {
      await db
        .collection("products")
        .doc("/" + req.body.id + "/")
        .create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
        });

      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  })();
});

//Read

//Update

//Delete

//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
