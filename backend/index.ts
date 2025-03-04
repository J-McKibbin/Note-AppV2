import express from "express";
import { PrismaClient } from "@prisma/client";
import {z} from "zod";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
const prisma = new PrismaClient()
const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
// Add this before server.listenHttp()


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
        res.status(400).json({error: "Invalid details entered try again..."});
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
            email
        }
    });
    //return message if the user exists
    if(user){
        res.status(400).json({error:"Bad request"});
        return;
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
        html:`<h1>Welcome</h1><p>Click<a href="http://localhost:5173/activate/${activationToken}">here</a></p>`
    };

    console.log("Sending email content");
    //Use the email transported to send the email verification
    emailTransporter.sendMail(emailContent);

    //respond with a success message
    res.status(201).json({message:"Account registered successfully"});
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
    //after the token is activated redirect the user to the login page to login
   // res.sendFile(path.join(__dirname, 'login.html'));

});// activate token


//create the dto
const loginDTO = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

//Creating the login endpoint
app.post("/login", async (req, res) => {
    console.log("Attempting to login");
    const parseResult = loginDTO.safeParse(req.body);

    if (!parseResult.data){
        res.status(404).json({error:"Login failed, try again..."});
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
        res.status(400).json({error:"Login details incorrect, user doesn't exist"})
        return;
    }

    if(!user.isActive){
        res.status(400).json({error: "You need to activate your account,\ncheck your emails"})
        return;
    }

    const passwordMatch = await Bun.password.verify(password, user.passwordHash)
    if(!passwordMatch){
        res.status(400).json({error:"Details entered incorrectly..."})
        return;
    }

    //if the password is correct then sign the jwt token
    const jwtToken = jwt.sign({
        email: user.email,
        username: user.username,
        updateAt: user.updatedAt,
        },
    Bun.env.JWT_SECRET ?? "",
        {expiresIn: "60000s"}
    );

    res.cookie("authToken", jwtToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
    });
    console.log("Cookie set in header")

    res.status(200).json({ token: jwtToken, userID: user.id, username: user.username})
});//login endpoint


//logout
app.post('/logout',(req, res) => {
    res.clearCookie("authToken");
    res.clearCookie("userID");
    res.clearCookie("username");
    res.status(200).json({message:"Log out successful!"})
})

const jwtProtect = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try{
        console.log("Attempting to protect");
        const authCookie = req.cookies.authToken
        console.log("Auth cookie content:" , authCookie)
        if(!authCookie){
            console.log("No auth cookie, redirecting to login")
            res.status(401).json({message: "Unauthorized, please log in"})
            return;
        }

        const secret = Bun.env.JWT_SECRET ?? "";
        console.log("Secret: " +secret);

        if(!secret){
            res.status(500).send("jwt secret doesn't exist");
            return;
        }
        //verify it
        let payload = jwt.verify(authCookie,secret)
        // let payload = jwt.verify(token, Bun.env.JWT_SECRET ?? "");
        if(typeof payload == 'string'){
            payload = JSON.parse(payload);
        }
        res.locals.payload = payload;
        next();
    }catch(error){jwtProtect
        console.error(error);
        res.clearCookie("authToken");
        res.status(500).json({message: "An error occurred, try logging in"})
    }
};//jwtProtect function

//Create note function
app.post("/createNote", async (req, res) => {
    console.log("Attempting to create note");
    //The note can be empty we just need the user id
    const note = req.body;
    console.log(note)
    const userid = note.userID;
    console.log(`loggin user id${userid}`)
    if(!userid){
        //send error
        res.status(400).json({error:"You need to enter a note with an id"})
        return
    }

    // const userId = note.id
    const newNote = await prisma.note.create({
        data:{
            noteTitle:"",
            noteDescription:"",
            user:{
                connect:{id:userid},
            }
        },
    });

    res.status(201).json({newNote});
    
    //we want to get the id, noteTitle and noteContent from the request
});


app.put("/updateNote/:id", async (req, res) => {
    const noteID = req.params.id;
    const {noteTitle, noteDescription} = req.body;
    try{
        const updatedNote = await prisma.note.update({
            where:{id:noteID},
            data: {noteTitle, noteDescription},
        })
        res.status(200).json({updatedNote});
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Something went wrong"});
    }
});


//Get notes endpoint
app.get('/notes/:userID' , async (req, res) => {
    console.log("Retrieving notes...")
    const {userID} = req.params;
    if(!userID){
        res.status(400).json({error:"Enter a valid user ID"})
        return;
    }
    //use the userID to search the db for notes made by the user
    let notes = await prisma.note.findMany({
        where:{
            userID: userID
        },
        orderBy:{
            updatedAt: 'desc',
        }
    })
    console.log(`this is the notes : ${notes}`)

    if(!notes){
        res.status(400).json({error:"No notes found"})
        return;
    }
    res.status(200).json({notes})
});


// Delete a note
app.delete('/deleteNote/:id' , async (req, res) => {
    console.log("Deleting note...")
    const {id} = req.params;
    try{
        const response = await prisma.note.delete({
            where:{id:id}
        })
        res.status(204).json({message:"Deleted note"})
    }catch(error){
        console.error(error);
        res.status(500).json({error:`Something went wrong ${error}`})
    }
})

//
// //The home route requires auth , so I have included JWTprotect auth in the endpoint
app.get("/api/home", jwtProtect, async (req, res) => {
    console.log("Hit /api/home route");
    res.status(200).json()
});

//Listen on a specific port for operations
const port = 3000
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

if (process.env.NODE_ENV === "production") {
    // Resolve the path to the frontend build folder (adjust if your structure is different)
    // Use fileURLToPath if you are using ES modules with __dirname workaround:
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const frontendPath = path.join(__dirname, "./dist");
    app.use(express.static(frontendPath));

    // Fallback route: for any route not matched, send index.html (for client-side routing)
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

export default app;

