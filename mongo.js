const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://pavi102fullstackopen:${password}@cluster0.zcdwl.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected");

    if (process.argv.length === 3) {
      console.log("phonebook:");
      Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
      });
    } else {
      const person = new Person({
        name,
        number,
      });
      person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
      });
    }
  })
  .catch(err => console.log(err));
