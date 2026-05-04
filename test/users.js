import supertest from "supertest";
import { expect } from "chai";
const request = supertest("https://gorest.co.in/public/v2/");

const token = "a00723bc302d64bd227871db552058d0f7553a77a7d0f3b474dbf221a732c754"
const userId = 8454711; // Replace with a valid user ID for testing
const page = 4;
const gender = "female";;

describe("Users", () => {
    it("[GET] /users", () => {
        // request
        //     .get(`users?access-token=${token}`)
        //     .end((err, res) => {
        //         expect(res.status).to.equal(200);
        //         expect(res.body.data).to.not.be.empty;
        //         done();
        //     });

        return request
            .get(`users?access-token=${token}`)
            .then((res) => {

                expect(res.status).to.equal(200);
                expect(res.body).to.exist;
                expect(res.body).to.not.be.empty;
            });
    });

    it("[GET], /users/:id", ()=> {
        return request
        .get(`users/${userId}?access-token=${token}`)
        .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.not.be.empty;
            expect(res.body.id).to.equal(userId);
        });
    })

    it("[GET], /users?page", ()=> {
        return request
        .get(`users?page=${page}&access-token=${token}`)
        .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.not.be.empty;
            
        });
    })

    it("[GET], /users?page&gender", ()=> {
        const urlQueryParams = `users?page=${page}&gender=${gender}&access-token=${token}`;
        return request
        .get(urlQueryParams)
        .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.not.be.empty;
            
            expect(res.headers['x-pagination-page']).to.equal("4");

            res.body.forEach((data) => {
                expect(data.gender).to.equal("female");
            }); 
            
        }); 
    });

    it("[POST], /users", ()=> {
        const data = {
            "name": "Test User",
            "email": `testuser-${Math.floor(Math.random() * 9)}@yopmail.com`,
            "gender": "female",
            "status": "active"
        };

        return request
        .post(`users`)
        .set("Authorization", `Bearer ${token}`)
        .send(data)
        .then((res) => {

            console.log(res.body);
            

        expect(res.status).to.equal(201);
        expect(res.body).to.exist;
        expect(res.body).to.not.be.empty;
        // expect(res.body.name).to.equal(data.name);
        // expect(res.body.email).to.equal(data.email);
        expect(res.body).to.deep.include(data);
            
        });
    });

    it.only("[PUT], /users/:id", ()=> {
        const data = {
            "name": "Updated Test User",
            "email": `updatedtestuser-${Math.floor(Math.random() * 9)}@yopmail.com`,
            "gender": "female",
            "status": "active"
        };

        return request
        .put(`users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(data)
        .then((res) => {

            console.log(res.body);  
        expect(res.status).to.equal(200);
        expect(res.body).to.exist;
        expect(res.body).to.not.be.empty;
        expect(res.body).to.deep.include(data);

        });
    });
});