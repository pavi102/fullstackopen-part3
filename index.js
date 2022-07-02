const express = require("express");
const morgan = require("morgan");

const app = express();

morgan.token("req-body", req => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :req-body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 99999);
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find(person => person.id === Number(req.params.id));
  console.log(person);
  if (!person) {
    return res.status(404).json({ error: `person not found` });
  }
  return res.json(person);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>
  `);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const existingPerson = persons.find(person => person.name === name);

  if (!name || !number) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  if (existingPerson) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = { id: generateId(), name, number };
  persons = persons.concat(newPerson);
  return res.status(201).json(newPerson);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
