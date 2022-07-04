import { useState, useEffect } from "react";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import Filter from "./Filter";
import Notification from "./Notification";
import phonebookService from "./services/phonebookService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then(persons => setPersons(persons));
  }, []);

  const flashNotification = ({ text, className, delay }) => {
    setMessage({
      text: text,
      className: className,
    });
    setTimeout(() => {
      setMessage(null);
    }, delay);
  };

  const addToPhonebookHandler = e => {
    e.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    const existingPerson = persons.find(person => person.name === newPerson.name);
    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already added to your phonebook, replace the old number with a new one?`
        )
      ) {
        phonebookService
          .updatePerson(existingPerson.id, {
            ...existingPerson,
            number: newPerson.number,
          })
          .then(updatedPerson => {
            flashNotification({
              text: `Updated ${updatedPerson.name}`,
              className: "success",
              delay: 5000,
            });
            setPersons(
              persons.map(person =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            );
          })
          .catch(error => {
            flashNotification({
              text: error.response.data.error,
              className: "error",
              delay: 5000,
            });
          });
      }
      return;
    }
    phonebookService
      .createPerson(newPerson)
      .then(newPerson => {
        flashNotification({
          text: `Added ${newPerson.name}`,
          className: "success",
          delay: 5000,
        });
        setPersons([...persons, newPerson]);
      })
      .catch(error => {
        if (error.status === 409) {
          phonebookService
            .updatePerson(existingPerson.id, newPerson)
            .then(updatedPerson => {
              flashNotification({
                text: `Updated ${updatedPerson.name}`,
                className: "success",
                delay: 5000,
              });
              setPersons(
                persons.map(person =>
                  updatedPerson.id === person.id ? updatedPerson : person
                )
              );
            });
        }
        flashNotification({
          text: error.response.data.error,
          className: "error",
          delay: 5000,
        });
      });
  };

  const deleteHandler = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService.deletePerson(person.id).then(res => {
        if (res.status === 204) {
          setPersons(persons.filter(_person => person.id !== _person.id));
        }
      });
    }
  };

  const newNameHandler = e => {
    setNewName(e.target.value);
  };

  const newNumberHandler = e => {
    setNewNumber(e.target.value);
  };

  const nameFilterHandler = e => {
    setNameFilter(e.target.value);
  };

  const filteredPersons = nameFilter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      {message && (
        <Notification message={message.text} className={message.className} />
      )}
      <Filter nameFilter={nameFilter} nameFilterHandler={nameFilterHandler} />
      <h2>add a new</h2>
      <PersonForm
        addToPhonebookHandler={addToPhonebookHandler}
        newNameHandler={newNameHandler}
        newNumberHandler={newNumberHandler}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons deleteHandler={deleteHandler} persons={filteredPersons} />
    </div>
  );
};

export default App;
