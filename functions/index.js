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

//Read products with given ID
app.get("/api/read/:id/", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      let product = await document.get();
      let response = product.data();

      return res.status(200).send(response);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  })();
});

//Read all products
app.get("/api/read/", (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];

      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return response;
      });
      return res.status(200).send(response);
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  })();
});

//Update
app.put("/api/update/:id/", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);

      await document.update({
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

//Delete
app.delete("/api/delete/:id/", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  })();
});

//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
