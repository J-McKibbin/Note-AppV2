# Note app with auth
This is a note app project.

I started by building the app with just an express with bun backend using prisma (using sqlite) for the DB and zod for valdiation
, using jwt tokens for authentication. I then added a frontend using vanilla JS with axios for the requests to the backend.

I decided to try something new, I have now built it into a React app where the auth is currently working.
Next, I will add the note CRUD functionality.

## Running the app
In the root dir (Auth Practice) run: bun run dev
In the Frontend run: bun run dev 