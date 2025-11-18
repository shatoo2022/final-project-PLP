# AI Tutor

A full-stack AI-powered tutoring platform (MERN + Groq) that provides lessons, quizzes, and progress tracking. The project includes a React (Vite) client and a Node/Express server with MongoDB for persistence. The server also contains an AI service for generating or assessing content.

## Highlights

- Single repository with `client/` (React + Vite) and `server/` (Node + Express).
- Authentication (register / login) and protected routes.
- Lessons, assessments, and user progress tracking.
- AI integration service for generating content or assessments.

## Tech stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (via mongoose)
- Auth: JWT-based authentication
- AI: Custom AI service (Groq)

## Repo structure

- `client/` — React app (Vite). Contains pages, components, context, and API service.
- `server/` — Express server with controllers, routes, models, services, and middleware.
- `server/config/` — DB connection and other server configuration.
- `server/services/aiService.js` — AI-related helpers used by the backend.

## Quick start (development)

Prerequisites:

- Node.js (16+ recommended)
- npm or yarn
- MongoDB (local or a hosted cluster)

1. Clone the repo

```bash
git clone <repo-url>
cd ai-tutor
```

2. Environment variables

Create a `.env` file in the `server/` directory with at least the following variables:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
Groq_API_KEY=your_Groq_api_key   # if the AI service requires it

# Optional (for the client)
VITE_API_URL=http://localhost:5000/api
```

Adjust names as needed if your project uses different environment variable names (e.g., check `server/config/` or `server/services/aiService.js`).

3. Install dependencies and run server

```bash
# In one terminal: server
cd server
npm install
npm run dev   # or `node server.js` / `npm start` depending on package.json
```

4. Install dependencies and run client

```bash
# In another terminal: client
cd client
npm install
npm run dev
```

Open the client in your browser (usually http://localhost:5173 or the port Vite reports).

## Environment variables (summary)

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — Server port (defaults commonly to 5000)
- `Groq_API_KEY` — API key for AI features (if used)
- `VITE_API_URL` — Base API URL used by the client (e.g., `http://localhost:5000/api`)

Check the server code for exact names if anything fails to load.

## API overview (high level)

The server provides routes for authentication, lessons, assessments, and progress. Typical route patterns:

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/lessons` — list lessons
- `GET /api/lessons/:id` — get one lesson
- `POST /api/assessments` — create/submit assessment
- `GET /api/progress` — get user progress (protected)

Refer to `server/routes/` and `server/controllers/` for the exact routes and payloads.

## Running in production / build

Build and serve the client as static assets, and run the server in production mode. Minimal steps:

1. Build client

```bash
cd client
npm run build
```

2. Serve the built client from your production server (e.g., serve static files from Express or host on CDN).

3. Start server with a process manager (PM2, systemd) and ensure environment variables are set.

## Tests

If the project has tests, run them from the corresponding folder. There are no test harnesses included by default in this repo snapshot. Consider adding unit/integration tests for controllers and front-end components.

## Development notes and tips

- Check `server/config/db.js` for how the MongoDB connection is configured.
- The client API helper (`client/src/services/api.js`) commonly reads `import.meta.env.VITE_API_URL` — update `VITE_API_URL` accordingly when running the client.
- Protected routes on the client typically use an `AuthContext` that stores the JWT and attaches Authorization headers.

## Contributing

1. Fork the repo and create a feature branch.
2. Implement changes and add tests for new behaviors.
3. Open a pull request with a clear description of what you changed and why.

## Potential improvements / TODOs

- Add automated tests (server and client).
- Add CI pipeline (GitHub Actions) for linting, testing, and builds.
- Improve documentation for API payloads and error responses.
- Add role-based access control if needed.

## License

Specify a license in the repository (e.g., MIT) or add `LICENSE` file. This project did not include a license file in the snapshot — add one if you plan to publish.

## Maintainers / Contact

If you have questions, open an issue or contact the repository maintainer.


- Update the README with exact npm scripts found in `server/package.json` and `client/package.json`.
- Add detailed API documentation by reading the route files and controller input/outputs.
- Add a `Makefile` or root-level `package.json` scripts for starting both client and server concurrently. 

