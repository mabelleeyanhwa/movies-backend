const request = require("supertest");
const app = require("../app");

const versionRoute = "/v2";
const teardownMongoose = require("../utils/testTeardownMongoose");
const movieData = require("../data/testMovieData");
const Movie = require("../models/movie.model");

describe("movies.route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await Movie.create(movieData);
  });

  afterEach(async () => {
    await Movie.deleteMany();
  });

  it("GET /movies should return all movies", async () => {
    const response = await request(app)
      .get(versionRoute + "/movies")
      .expect(200);

    expect(response.body).toEqual(movieData);
  });

  it("GET /movies should throw 500 error if there is a internal server error", async () => {
    const origMovieFind = Movie.find;
    Movie.find = jest.fn();
    Movie.find.mockImplementationOnce(() => {
      const err = new Error();
      throw err;
    });
    const { body: error } = await request(app)
      .get(versionRoute + "/movies")
      .expect(500);
    expect(error).toEqual({ error: "Internal server error" });
    Movie.find = origMovieFind;
  });

  it("POST /movies should return new movie when new movie is valid", async () => {
    const { body: actualMovie } = await request(app)
      .post(versionRoute + "/movies")
      .send({ movieName: "The Greatest Showman" })
      .expect(201);

    expect(actualMovie).toMatchObject({
      id: movieData.length + 1,
      movieName: "The Greatest Showman",
    });
  });

  it("POST /movies should return 400 bad request and error message when new movie is not valid", async () => {
    const { body } = await request(app)
      .post(versionRoute + "/movies")
      .send({ badRequest: "" })
      .expect(400);

    expect(body).toEqual({ error: expect.any(String) });
  });
});
