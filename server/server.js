const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("../src/graphql/schema/index");
const graphqlResolvers = require("../src/graphql/resolvers/index");
const isAuth = require("../src/middleware/is-auth")

const app = express();
const port = process.env.PORT || 8081;
const publicPath = path.join(__dirname, "..", "public");

app.use(bodyParser.json());

app.use(express.static(publicPath));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if(req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use("/graphql", graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@booking-app-ygssb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(
    app.listen(port)
  ).catch(err => {
    console.log(err);
  }
);