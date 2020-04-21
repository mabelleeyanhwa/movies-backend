const movies = [
  {
    id: 1,
    movieName: "The Lion King",
  },
  {
    id: 2,
    movieName: "Frozen 2",
  },
];

const findAll = () => {
  return movies;
};

const findOneById = (id) => {
  return movies.find((movie) => movie.id === id);
};

const createOne = (newMovie) => {
  movies.push(newMovie);
};

const getNextId = () => {
  return movies.length + 1;
};

module.exports = {
  findAll,
  findOneById,
  createOne,
  getNextId,
};
