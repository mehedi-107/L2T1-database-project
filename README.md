# Health Harbor Navigator

Health Harbor Navigator is a DBMS term project for managing hospital workflows across patients,
doctors, nurses, and administrators.

## Core Features

- Role-based login for doctors, nurses, patients, and administrators
- Patient registration and appointment scheduling
- Doctor appointment completion and recent activity views
- Ward, cabin, bed, and admission management
- Staff leave request approval/rejection workflow
- Internal notification and messaging features
- PostgreSQL-backed stored procedure, trigger, and function integrations

## Project Structure

```text
dbms_project/
  client/                 React frontend
    src/
      components/         Role and feature UI modules
      context/            Authentication/session context
      hooks/              Reusable React hooks
      routes/             App route guards and route declarations
  server/                 Express API
    src/
      config/             Environment and database configuration
      db/                 PostgreSQL pool
      middleware/         Express error and 404 handlers
      routes/             Feature-based API route modules
  Project_RubricWise_Allignment/
                          SQL/functions/procedures/triggers mapped to rubric items
```

## Backend Setup

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

Configure PostgreSQL in `server/.env`. You can use either `DATABASE_URL` or the individual
`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` fields.

## Frontend Setup

```bash
cd client
npm install
npm start
```

The React app proxies API requests to `http://localhost:5000` during development.

## Verification

```bash
npm --prefix client run build
node -e "require('./server/src/app')"
```

The backend exposes a health check at:

```text
GET /health
```
