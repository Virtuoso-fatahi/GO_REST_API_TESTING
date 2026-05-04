import dotenv from "dotenv";
dotenv.config();

import auth from "../utils/auth.js";
import { fa, faker } from '@faker-js/faker';
import supertest from "supertest";
const request = supertest("https://gorest.co.in/public/v2/");
const token = process.env.validToken;

export const createRandomUser = async () => {
  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(["male", "female"]),
    status: faker.helpers.arrayElement(["active", "inactive"]),
  };

  const res = await request
    .post(`users`)
    .set("Authorization", `Bearer ${token}`)
    .send(userData);

  return res.body;
};
