require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("req-body", req => JSON.stringify(req.body));

app.use(express.json());
app.use(express.static("build"));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :req-body")
);
app.use(cors());

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});
  return res.json(persons);
});

app.get("/api/persons/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: `person not found` });
    }
    return res.json(person);
  } catch (err) {
    res.status(400).send({ error: "malformatted id" });
  }
});

app.get("/info", async (req, res) => {
  const personsLen = await (await Person.find({})).length;
  const date = new Date();
  res.send(`
  <p>Phonebook has info for ${personsLen} people</p>
  <p>${date}</p>
  `);
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;
  // const existingPerson = await Person.findOne({ name: name });

  if (!name || !number) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  // if (existingPerson) {
  //   return res.status(400).json({ error: "Name must be unique" });
  // }

  const person = new Person({
    name,
    number,
  });

  const savedPerson = await person.save();
  return res.status(201).json(savedPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
