# School Equipment Lending Platform Backend

This is an ASP.NET Core Web API for managing school equipment lending, designed to integrate with a React frontend.

## Features
- Equipment CRUD operations
- User management (admin/student roles)
- Borrow/return requests with approval workflow

## API Endpoints

### Equipment
- `GET /api/equipment` — List all equipment
- `POST /api/equipment` — Add new equipment

### Users
- `GET /api/users` — List all users
- `POST /api/users` — Add new user

### Requests
- `GET /api/requests` — List all requests
- `POST /api/requests` — Create a new request

## Running the API

1. Ensure you have [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0) installed.
2. In the `server` directory, run:
   ```powershell
   dotnet run --project SchoolEquipmentApi/SchoolEquipmentApi.csproj
   ```
3. The API will be available at `http://localhost:5000` (or the port shown in the console).

## Integrating with React Frontend
- Use the above endpoints from your React app using `fetch` or `axios`.
- Example (fetch all equipment):
  ```js
  fetch('http://localhost:5000/api/equipment')
    .then(res => res.json())
    .then(data => console.log(data));
  ```
- Adjust the base URL/port if needed.

## Notes
- Data is stored in-memory for demo purposes. Restarting the API will reset all data.
- For production, connect to a database and implement authentication.

---

For more details, see the controllers and models in the `SchoolEquipmentApi` project.
