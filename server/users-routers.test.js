const request = require('supertest');
const express = require('express');
const userRouter=  require('./routers/users-router');
const mongoose =require('mongoose');
const bodyParser= require('body-parser');
const mod = require("./models");
const User = mod["User"];



const app = express();


app.use(express.json())
app.use("/users",userRouter);


beforeAll(async () =>{
    await mongoose.connect("mongodb+srv://antenmanuuel:anten2001@cluster0.aaqyrxt.mongodb.net/test")
})

afterAll(async()=>{ await mongoose.connection.close();})

describe('User Router',()=>{
    let createdUserId;
    test('GET /users should return an array of users', async () =>{
        const response = await request(app).get('/users');
        expect(Array.isArray(response.body)).toBeTruthy();
        
    })

    test('POST /users should create a new user', async () => {
        const testUser = {username: 'testUser1003',games:[]};
        const response = await request(app).post('/users').send(testUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.username).toBe(testUser.username);
        createdUserId = response.body._id;
    })
    afterAll(async () => {
        if (createdUserId) {
            await User.findByIdAndDelete(createdUserId);
        }
    });
})