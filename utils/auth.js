import dotenv from 'dotenv';
dotenv.config();
import supertest from "supertest";
const request = supertest(process.env.baseURL);

export default request;
