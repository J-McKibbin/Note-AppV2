import { describe, it, expect, beforeAll,beforeEach, afterAll } from "bun:test";
import {PrismaClient} from '@prisma/client'
import request from "supertest";
import app from '../../../index'
import { chromium } from "playwright";

let browser;
let page;

const prisma = new PrismaClient();

//clear the db before each test
beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.activationToken.deleteMany();
    await prisma.note.deleteMany();
    browser = await chromium.launch();
    page = await browser.newPage(); 
});

afterAll( async () => {
    await prisma.$disconnect();
    await browser.close();
});

//frontend testing
describe("Register flow", () => {
    it("Should register a user successfully ", async () => {
        //nav to the page
        await page.goto('http://localhost:5173/register');
        await page.fill('#emailInput', 'testemail@email.com')
        await page.fill('#usernameInput', 'arandomusername')
        await page.fill('#passwordInput', 'arandompassword')
        await page.fill('#passwordConfirmInput', 'arandompassword')
        await page.click('#registerButton')

        await page.waitForNavigation();

        const currentURL = page.url();
        expect(currentURL).toBe('http://localhost:5173/')
    });
});

// Backend testing
describe("POST /register", () => {
    it("User created correctly' ", async () =>{
        const response = await request(app).post("/register").send({
            email: "email@email.com",
            username: "testingusername",
            password: "password1",
            passwordConfirmation: "password1"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Account registered successfully")
    });

    it("Tests password mismatch' ", async () =>{
        const response = await request(app).post("/register").send({
            email: "email69@email.com",
            username: "testingusername",
            password: "password1",
            passwordConfirmation: "password111"
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Passwords do not match")
    });


    it("Tests non unique email' ", async () =>{
        const response = await request(app).post("/register").send({
            email: "email@email.com",
            username: "testingusername",
            password: "password1",
            passwordConfirmation: "password1"
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Bad request")
    });
    
});


