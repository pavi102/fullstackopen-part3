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

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: `person not found` });
    }
    return res.json(person);
  } catch (err) {
    next(err);
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

app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body;
  const existingPerson = await Person.findOne({ name });
  if (!name || !number) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  if (existingPerson) {
    return res.status(409).json({ error: "Person with that name already exists" });
  }

  const person = new Person({
    name,
    number,
  });
  try {
    const savedPerson = await person.save();
    return res.status(201).json(savedPerson);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;
  const newPerson = { name, number };
  try {
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, newPerson, {
      new: true,
      runValidators: true,
      context: "query",
    });
    return res.json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
