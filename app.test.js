const request = require("supertest");
const app = require("./app");

const sampleMovie = { movieName: "Lion King" };

const versionRoute = "/v2";

jest.mock("./data/movies.data", () => {
  const originalMoviesData = jest.requireActual("./data/movies.data");
  return {
    findOneById: jest.fn(),
    findAll: jest.fn(),
    getNextId: () => {
      return 1;
    },
    createOne: originalMoviesData.createOne,
  };
});
const { findOneById, findAll, getNextId } = require("./data/movies.data");

describe("App", () => {
  beforeEach(() => {});
  it("POST /movies should return a new movie object", async () => {
    const newMovie = sampleMovie;
    const { body: actualMovie } = await request(app)
      .post(versionRoute + "/movies")
      .send(newMovie)
      .expect(201);
    expect(actualMovie).toMatchObject(newMovie);
  });

  it("GET /movies should return one movie object in array", async () => {
    const expectedMovies = [{ id: 1, movieName: sampleMovie.movieName }];
    findAll.mockReturnValue(expectedMovies);
    const response = await request(app)
      .get(versionRoute + "/movies")
      .expect(200);
    expect(response.body).toEqual(expectedMovies);
  });

  it("GET /movies/:id should return correct movie object", async () => {
    findOneById.mockReturnValue({ ...sampleMovie, id: 1 });
    const expectedMovie = sampleMovie;
    const response = await request(app)
      .get(versionRoute + "/movies/1")
      .expect(200);
    expect(response.body).toMatchObject(expectedMovie);
  });

  it("GET /director", async () => {
    const expectedDirectors = { name: "bestDirector" };
    const response = await request(app)
      .get(versionRoute + "/director")
      .expect(200);
    expect(response.body).toEqual(expectedDirectors);
  });
});
