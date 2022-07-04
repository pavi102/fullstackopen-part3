const PersonForm = ({
  addToPhonebookHandler,
  newNameHandler,
  newNumberHandler,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={addToPhonebookHandler}>
      <div>
        name: <input value={newName} onChange={newNameHandler} />
      </div>
      <div>
        number: <input value={newNumber} onChange={newNumberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
