import { describe, it, expect, beforeAll, beforeEach, afterAll } from "bun:test";
import {PrismaClient} from '@prisma/client'
import request from "supertest";
import app from '../../../index'
import { chromium } from "playwright";
import bcrypt from 'bcrypt';

let browser;
let page;

const prisma = new PrismaClient();

// Clear the db before each test
beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.activationToken.deleteMany();
    await prisma.note.deleteMany();
    browser = await chromium.launch();
    page = await browser.newPage(); 

// Create hashed password
    const hashedPassword = await bcrypt.hash("password1", 10)

// Creating a new user for testing on
    await prisma.user.create({
        data:{
            email: "email@email.com",
            username:"username",
            passwordHash: hashedPassword,
            isActive:true
        }
    })

    await prisma.user.create({
        data:{
            email: "email2@email.com",
            username:"username2",
            passwordHash: hashedPassword,
            isActive:false
        }
    })
});

afterAll( async () => {
    await prisma.$disconnect();
    await browser.close();
});

//frontend testing
// describe("Register flow", () => {
//     it("Should register a user successfully ", async () => {
//         //nav to the page
//         await page.goto('http://localhost:5173/register');
//         await page.fill('#emailInput', 'testemail@email.com')
//         await page.fill('#usernameInput', 'arandomusername')
//         await page.fill('#passwordInput', 'arandompassword')
//         await page.fill('#passwordConfirmInput', 'arandompassword')
//         await page.click('#registerButton')

//         await page.waitForNavigation();

//         const currentURL = page.url();
//         expect(currentURL).toBe('http://localhost:5173/')
//     });
// });

// Backend testing
describe("POST /login", () => {
    it("User login correctly' ", async () =>{
        const response = await request(app).post("/login").send({
            email: "email@email.com",
            password: "password1",
        });
        expect(response.status).toBe(200);
        const responseBody = await response.body;
        expect(responseBody).toMatchObject({
            token:expect.any(String),
            userID:expect.any(String),
            username: "username"
        })
    });

    it("user enters unknown email ", async () =>{
        const response = await request(app).post("/login").send({
            email: "efwokjfnwofkn@email.com",
            password: "password1",
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Login details incorrect, user doesn't exist")
    });

    it("user enters incorrect password ", async () =>{
        const response = await request(app).post("/login").send({
            email: "email@email.com",
            password: "wiufweofknewfo",
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Details entered incorrectly...")
    });

    it("User hasn't activated account ", async () =>{
        const response = await request(app).post("/login").send({
            email: "email2@email.com",
            password: "password1",
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("You need to activate your account,\ncheck your emails")
    });
    
});


