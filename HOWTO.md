## How to run the demo

0. Setup the blocklet server environment according to the [official guide](https://www.arcblock.io/docs/blocklet-developer/getting-started/)
1. Pulling the latest code from github
2. Run `npm install` to install the dependencies
3. Copy `.env.example` to `.env` and edit the `DATABASE_URL` option
4. Run `npx prisma migrate dev --name init` to migrate the database
5. Run `blocklet dev` to start the development server
6. Open the link printing in the console with your browser to see the result