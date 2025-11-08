# MongoDB Integration Setup Guide

## Prerequisites
Before running the application with MongoDB, you need to install and configure MongoDB.

## MongoDB Installation

### Option 1: MongoDB Community Edition (Local Installation)
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install MongoDB following the official installation guide for your OS
3. Start MongoDB service:
   - Windows: `net start MongoDB` or use MongoDB Compass
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Option 2: MongoDB Atlas (Cloud Database)
1. Create a free account at https://cloud.mongodb.com/
2. Create a new cluster
3. Get the connection string and update `appsettings.json`

### Option 3: Docker (Recommended for Development)
```bash
# Run MongoDB in Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Or use Docker Compose (create docker-compose.yml)
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: school_equipment_db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
volumes:
  mongodb_data:
```

## Configuration

### Connection String
Update the connection string in `appsettings.json` and `appsettings.Development.json`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "SchoolEquipmentDB",
    "UsersCollectionName": "Users",
    "EquipmentCollectionName": "Equipment",
    "RequestsCollectionName": "Requests"
  }
}
```

For MongoDB Atlas, use the connection string provided by Atlas:
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb+srv://username:password@cluster.mongodb.net/",
    "DatabaseName": "SchoolEquipmentDB"
  }
}
```

## Running the Application

1. Ensure MongoDB is running
2. Navigate to the API directory: `cd server/SchoolEquipmentApi`
3. Run the API: `dotnet run`

The application will automatically:
- Connect to MongoDB
- Create the database and collections if they don't exist
- Seed initial data (users and equipment)

## Default Data

The application will create these default users:
- Administrator: `admin@school.edu` / `admin123`
- Lab Assistant: `labassistant@school.edu` / `lab123`
- Teacher: `teacher@school.edu` / `teacher123`
- Student: `student@school.edu` / `student123`

And sample equipment items across different categories (sports, lab, music, art).

## Troubleshooting

### Connection Issues
- Verify MongoDB is running: `mongo --eval "db.runCommand('ping')"`
- Check the connection string format
- Ensure the MongoDB port (27017) is not blocked by firewall

### Permission Issues
- Ensure the application has permission to create databases
- For Atlas, ensure your IP is whitelisted

### Docker Issues
- Check if Docker is running: `docker ps`
- Verify MongoDB container is running: `docker logs mongodb`

## Production Considerations

1. **Security**: Use authentication and SSL in production
2. **Performance**: Consider indexing frequently queried fields
3. **Backup**: Implement regular backup strategies
4. **Monitoring**: Use MongoDB monitoring tools

## API Changes

With MongoDB integration, note these ID changes:
- Equipment IDs are now MongoDB ObjectIds (strings, not integers)
- User IDs are now MongoDB ObjectIds (strings, not integers)
- Request IDs are now MongoDB ObjectIds (strings, not integers)

The frontend should handle these as strings in API calls.