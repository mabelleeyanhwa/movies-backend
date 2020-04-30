const User = require("../models/user.model.js");
const userData = require("../data/testUserData");
const request = require("supertest");
const app = require("../app");
const teardownMongoose = require("../utils/testTeardownMongoose");

const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("users.route", () => {
  const versionRoute = "/v2";
  let signedInAgent;
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await User.create(userData);
    signedInAgent = request.agent(app);
    await signedInAgent.post(versionRoute + "/users/login").send(userData[0]);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await User.deleteMany();
  });

  describe("/login", () => {
    it("should log user in and set cookie when username and password is correct", async () => {
      const { text: message } = await request(app)
        .post(versionRoute + "/users/login")
        .send(userData[0])
        .expect("set-cookie", /token=.*; Path=\/; Expires=.* HttpOnly/)
        .expect(200);
      expect(message).toEqual("you are logged in");
    });

    it("should not log user in when password is incorrect", async () => {
      const wrongUser = {
        password: "wrongpassword",
        username: userData[0].username,
      };
      const { body: message } = await request(app)
        .post(versionRoute + "/users/login")
        .send(wrongUser)
        .expect(400);
      expect(message).toEqual({ error: "Wrong password" });
    });
  });

  describe("/users", () => {
    it("POST / should return new user", async () => {
      const expectedUser = {
        username: "newUser",
        password: "12345",
      };
      const { body: actualUser } = await request(app)
        .post(versionRoute + "/users")
        .send(expectedUser)
        .expect(200);
      expect(actualUser.username).toBe(expectedUser.username.toLowerCase());
      expect(actualUser.password).not.toBe(expectedUser.password);
    });

    it("GET /:username should return user information when login as correct user", async () => {
      const userIndex = 0;
      const { password, ...userInfoWithoutPassword } = userData[userIndex];
      const expectedUsername = userData[userIndex].username;

      jwt.verify.mockReturnValueOnce({ username: expectedUsername });

      const { body: actualUser } = await signedInAgent
        .get(`${versionRoute}/users/${expectedUsername}`)
        .expect(200);
      expect(jwt.verify).toBeCalledTimes(1);
      expect(actualUser).toMatchObject(userInfoWithoutPassword);
    });

    it("GET /:username should return 401 unauthorized when token is invalid", async () => {
      const expectedUsername = userData[0].username; //setup

      jwt.verify.mockImplementationOnce(() => {
        //mock
        throw new Error("token not valid");
      });
      const { body: error } = await signedInAgent //expect
        .get(`${versionRoute}/users/${expectedUsername}`)
        .expect(401);
      expect(jwt.verify).toBeCalledTimes(1);
      expect(error.error).toBe("You are not authorized");
    });
  });

  describe("/logout", () => {
    it("should logout and clear cookie", async () => {
      const response = await request(app)
        .post(versionRoute + "/users/logout")
        .expect(200);
      expect(response.text).toBe("You have been logged out");
      expect(response.headers["set-cookie"][0]).toMatch(/^token=/);
    });
  });
});
