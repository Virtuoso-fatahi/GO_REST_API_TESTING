import dotenv from 'dotenv';
dotenv.config();
import auth from "../utils/auth.js";
import { createRandomUser } from "../helper/user_helper.js";
import { expect } from "chai";

const token = process.env.validToken;

const page = 4;
const gender = "female";

describe("Users", () => {
  let userId; // Replace with a valid user ID for testing
  describe("POST /users", () => {
    it("Register a new user", () => {
      const data = {
        name: "Test User",
        email: `testuser-${Math.floor(Math.random() * 9999)}@yopmail.com`,
        gender: "female",
        status: "active",
      };

      return auth
        .post(`users`)
        .set("Authorization", `Bearer ${token}`)
        .send(data)
        .then((res) => {
          userId = res.body.id; // Store the created user ID for later tests

          expect(res.status).to.equal(201);
          expect(res.body).to.exist;
          expect(res.body).to.not.be.empty;
          expect(res.body).to.deep.include(data);
        });
    });
  });

  describe("GET /users", () => {
    it("Retrieve all users", () => {
      return auth.get(`users?access-token=${token}`).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.exist;
        expect(res.body).to.not.be.empty;
      });
    });

    it("Retrieve a single user with valid id, /users/:id", () => {
      return request
        .get(`users/${userId}?access-token=${token}`)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body).to.not.be.empty;
          expect(res.body.id).to.equal(userId);
        });
    });

    it("Retrieve users from a single page, /users?page", () => {
      return request
        .get(`users?page=${page}&access-token=${token}`)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body).to.not.be.empty;
        });
    });

    it("Retrieve users with query params", () => {
      const urlQueryParams = `users?page=${page}&gender=${gender}&access-token=${token}`;
      return request.get(urlQueryParams).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.exist;
        expect(res.body).to.not.be.empty;

        expect(res.headers["x-pagination-page"]).to.equal("4");

        res.body.forEach((data) => {
          expect(data.gender).to.equal("female");
        });
      });
    });
  });

  describe("PUT /users", () => {
    it("Update a user with valid id", () => {
      const data = {
        name: "Updated Test User",
        email: `updatedtestuser-${Math.floor(Math.random() * 9)}@yopmail.com`,
        gender: "female",
        status: "active",
      };

      return request
        .put(`users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(data)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body).to.not.be.empty;
          expect(res.body).to.deep.include(data);
        });
    });
  });

  describe("DELETE /users", () => {
    it("Delete a user with valid id", () => {
      return request
        .delete(`users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .then((res) => {
          console.log(res.body);

            expect(res.status).to.equal(204);
            expect(res.body).to.be.empty;
        });
    });
  });
});
