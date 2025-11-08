# School Equipment Portal - Full Stack Integration

This project integrates a React frontend with a C# ASP.NET Core Web API backend.

## Project Structure

- **Frontend**: React application (port 3000)
- **Backend**: C# ASP.NET Core Web API (port 4000)

## Running the Application

### 1. Start the Backend API

1. Navigate to the server directory:
   ```bash
   cd server/SchoolEquipmentApi
   ```

2. Run the API:
   ```bash
   dotnet run
   ```

   The API will start at `http://localhost:4000` and Swagger UI will be available at `http://localhost:4000/swagger`

### 2. Start the Frontend

1. In a new terminal, navigate to the root directory:
   ```bash
   cd school-equipment-portal
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start at `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users` - Get all users

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Requests
- `GET /api/requests` - Get all borrow requests
- `GET /api/requests/{id}` - Get request by ID
- `GET /api/requests/user/{email}` - Get requests by user email
- `POST /api/requests` - Create new borrow request
- `PUT /api/requests/{id}/status` - Update request status
- `DELETE /api/requests/{id}` - Delete request

## Default Users

The API comes with pre-configured test users:

- **Admin**: admin@school.edu / admin123
- **Staff**: teacher@school.edu / teacher123
- **Student**: student@school.edu / student123

## Features Integrated

✅ User authentication with API
✅ Equipment management (CRUD operations)
✅ Borrow request system
✅ Request approval workflow
✅ CORS configuration
✅ Error handling
✅ Loading states

## Development Notes

- The backend uses in-memory storage for demo purposes
- CORS is configured to allow requests from `http://localhost:3000`
- All API responses are JSON formatted
- Error handling includes user-friendly messages