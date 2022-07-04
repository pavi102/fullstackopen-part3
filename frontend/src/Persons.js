const Persons = ({ persons, deleteHandler }) => {
  return (
    <ul>
      {persons.map(person => {
        return (
          <li key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => deleteHandler(person)}>delete</button>
          </li>
        );
      })}
    </ul>
  );
};
export default Persons;
