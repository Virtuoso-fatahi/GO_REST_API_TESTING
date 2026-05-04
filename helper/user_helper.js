import supertest from "supertest";
const request = supertest("https://gorest.co.in/public/v2/");
const token =
  "a00723bc302d64bd227871db552058d0f7553a77a7d0f3b474dbf221a732c754";

export const createRandomUser = async () => {
  const userData = {
    name: "Test User",
    email: `testuser-${Math.floor(Math.random() * 9999)}@yopmail.com`,
    gender: "male",
    status: "active",
  };

  const res = await request
    .post(`users`)
    .set("Authorization", `Bearer ${token}`)
    .send(userData);

  return res.body.id;
};
