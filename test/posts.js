import dotenv from 'dotenv';
dotenv.config();
import { expect } from "chai";
import auth from "../utils/auth.js";
import { createRandomUser } from "../helper/user_helper.js";

const token = process.env.validToken;
const invalidToken = process.env.invalidToken; 

describe.only("User Post", () => {
  let postId, userId;

  before(async () => {
    userId = await createRandomUser();
  });

  it("Create a post for a user", async () => {
    const postData = {
      user_id: userId,
      title: "Test Post Title",
      body: "This is the body of the test post.",
    };

    const postRes = await auth
      .post(`posts`)
      .set("Authorization", `Bearer ${token}`)
      .send(postData);

    expect(postRes.status).to.equal(201);
    expect(postRes.body).to.exist;
    expect(postRes.body).to.not.be.empty;
    expect(postRes.body).to.deep.include(postData);

    postId = postRes.body.id; // Store the created post ID for later tests
  });

  it("Retrieve a post with valid post id, /posts/:id", async () => {
    const res = await auth
      .get(`posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.exist;
    expect(res.body).to.not.be.empty;
    expect(res.body.id).to.equal(postId);
  });

  describe("Negative Test", () => {
    it("Create a post without token", async () => {
      const postData = {
        user_id: userId,
        title: "Test Post Title",
        body: "This is the body of the test post.",
      };

      const postRes = await auth
        .post(`posts`)
        //   .set("Authorization", `Bearer ${token}`)
        .send(postData);

      expect(postRes.status).to.equal(401);
      expect(postRes.body.message).to.equal("Authentication failed");
    });

    it("Create a post with invalid token", async () => {
      const postData = {
        user_id: userId,
        title: "Test Post Title",
        body: "This is the body of the test post.",
      };

      const postRes = await auth
        .post(`posts`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(postData);

      console.log(postRes.body);

      expect(postRes.status).to.equal(401);
      expect(postRes.body.message).to.equal("Invalid token");
    });

    it.only("Create a post with incomplete field", async () => {
      const postData = {
        user_id: userId,
        title: "Test Post Title",
      };

      const postRes = await auth
        .post(`posts`)
        .set("Authorization", `Bearer ${token}`)
        .send(postData);

      const err = postRes.body[0];

      expect(postRes.status).to.equal(422);
      expect(err.field).to.equal("body");
      expect(err.message).to.equal("can't be blank");
    });
  });
});
