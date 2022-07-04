const Filter = ({ nameFilter, nameFilterHandler }) => {
  return (
    <div>
      filter shown with a <input value={nameFilter} onChange={nameFilterHandler} />
    </div>
  );
};
export default Filter;
