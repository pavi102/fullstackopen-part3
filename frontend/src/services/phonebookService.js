import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const createPerson = newPerson => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`).then(res => res);
};

const updatePerson = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);
};

const exports = { getAll, createPerson, deletePerson, updatePerson };

export default exports;
