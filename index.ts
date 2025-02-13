import express from "express";
import { PrismaClient } from "@prisma/client";
import {z} from "zod";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as path from "node:path";
const prisma = new PrismaClient()
const app = express();
app.use(express.json());

const emailTransporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        //Access the mailtrap credentials via .env file
        user: Bun.env.MAILTRAP_USER ?? "",
        pass: Bun.env.MAILTRAP_PASSWORD ?? "",
    }
});

console.log(emailTransporter);

// Creating a data transfer object
const registerDto = z.object({
    email: z.string().email(),
    username: z.string().min(5).max(20),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8)
});

// type registerDto = z.infer<typeof registerDto>;
// Setting up the database with prisma
app.post('/register', async(req, res) => {
   //Store the entered details from the user
    const body = registerDto.safeParse(req.body);
    if(!body.success){
        res.status(400).json({error: body.error});
        return;
    }

    //Retreive the data from the request body
    const { email, username, password, passwordConfirmation } = body.data;

    //If the pasword and password confirmation don't match respond with error
    if(password !== passwordConfirmation){
        res.status(400).json({error: "Passwords do not match"});
        return;
    }
    //Hash the password
    const passwordHash = await Bun.password.hash(password);

    //If the passwords do match then check if the account exists already
    let user = await prisma.user.findUnique({
        where: {
            email,
            username,
        }
    });
    //return message if the user exists
    if(user){
        res.status(400).json({error:"Bad request"});
    }

    //If the user doesn't exist then create the user
    user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash
        },
    });

    //Create the activation token
    const activationToken = crypto.randomBytes(32).toString("hex");
    await prisma.activationToken.create({
        data:{
            token:activationToken,
            userId: user.id
        }
    });

    //create the content of the email
    const emailContent = {
        from:"example@example.com",
        to:email,
        subject:"Welcome, activate your account",
        //TODO Insert the activation token in the html below
        html:`<h1>Welcome</h1><p>Click<a href="http://localhost:3000/activate/${activationToken}">here</a></p>`
    };

    //Use the email transported to send the email verification
    emailTransporter.sendMail(emailContent);

    //respond with a success message
    res.status(200).json({redirect:'/home'})
});

app.get("/activate/:token", async (req, res) =>{
    //get the token from the params
    console.log("accessing activate endpoint")
   const { token } = req.params;
   const activateToken = await prisma.activationToken.findUnique({
       where: {
           token,
       },
   });
   if(!activateToken){
    res.status(400).send("Token doesn't exist")
    return;
   }

   //else activate the user
    await prisma.user.update({
        where:{
            id: activateToken.userId
        },
        data:{
            isActive : true
        }
    });
   console.log("user has been activated")
   res.status(200).send("user activated successfully")
});// activate token


//create the dto
const loginDTO = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

//Creating the login endpoint
app.get("/login", async (req, res) => {
    const parseResult = loginDTO.safeParse(req.body);
    if(!parseResult){
        res.status(400).send("An error occurred");
        return;
    }

    if (!parseResult.data){
        res.status(404).json({error:"No token found"});
        return;
    }
    
    //if there is no error then we can obtain the details from the result
    const {email, password} = parseResult.data;
    //then find the user using their email
    const user = await prisma.user.findUnique({
        where:{
            email,
        },
    })

    //verify if the user is found
    if(!user){
        res.status(400).send("User not found")
        return;
    }

    const passwordMatch = await Bun.password.verify(password, user.passwordHash)
    if(!passwordMatch){
        res.status(400).send("Password is incorrect")
    }

    //if the password is correct then sign the jwt token
    const jwtToken = jwt.sign({
        email: user.email,
        username: user.username,
        updateAt: user.updatedAt,
        },
    Bun.env.JWT_SECRET ?? ""
    );

    res.status(200).json({token: jwtToken})
});//login endpoint

const jwtProtect = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try{
        //check the header to see if the auth token is included
        if(!req.header('Authorization')){
            res.status(404).send("You don't have access to this");
        };

        //get the token from the header
        const tokenStr = req.header("Authorization") ?? "";
        const token = tokenStr.split("Bearer")[1];

        //verify it
        let payload = jwt.verify(token, Bun.env.JWT_SECRET ?? "");
        if(typeof payload == 'string'){
            payload = JSON.parse(payload);
        };
        res.locals.payload = payload;
        next();
    }catch(error){
        res.status(400).send("An error occurred with the JWT token")
    };
};//pwtProtect function

app.use(jwtProtect);

app.get("/home", async (req, res) => {
    console.log("You are on the home page")
    res.sendFile(path.join(__dirname, "home.html"));
})

app.get('/', async (req, res) =>{
    console.log("You are on the login page")
    res.sendFile(path.join(__dirname, "index.html"));
});

//Listen on a specific port for operations
const port = 3000
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

