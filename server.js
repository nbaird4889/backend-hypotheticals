
///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require("dotenv").config();
const { PORT, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//import middleware
const cors = require("cors");
const morgan = require("morgan");


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const QuestionSchema = new mongoose.Schema({
    question_type: String,
    question: String,
    choices: String,
    submitted_by: String,
});

const Question = mongoose.model("Question", QuestionSchema);

const AnswerSchema = new mongoose.Schema({
    answer: String,
    submitted_by: String,
});

const Answer = mongoose.model("Answer", AnswerSchema);


///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////

//QUESTION INDEX ROUTE 
app.get("/", async (req, res) => {
    try {
        res.json(await Question.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//ANSWER INDEX ROUTE


// QUESTION DELETE ROUTE
app.delete("/:id", async (req, res) => {
    try {
      res.json(await Question.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
});

// QUESTION UPDATE ROUTE
app.put("/:id", async (req, res) => {
    try {
      res.json(
        await Question.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
});

// QUESTION CREATE ROUTE
app.post("/", async (req, res) => {
    try {
        res.json(await Question.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));