const request = require("supertest");
const app = require("./app");

const teardownMongoose = require("./utils/testTeardownMongoose");

describe("App", () => {
  afterAll(async () => await teardownMongoose());
  const versionRoute = "/v2";
  it("GET /director", async () => {
    const expectedDirectors = { name: "bestDirector" };
    const response = await request(app)
      .get(versionRoute + "/director")
      .expect(200);
    expect(response.body).toEqual(expectedDirectors);
  });
});
