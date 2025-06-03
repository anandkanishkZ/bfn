# Sequelize Integration in BFN Project

## Overview
This document explains how Sequelize ORM has been integrated into the Blood For Nepal (BFN) project to replace direct SQL queries with a more object-oriented approach to database operations.

## Implementation Details

### 1. Models

#### User Model (`models/user.js`)
- Represents the `users` table in the database
- Has fields: id, name, email, password, role, created_at
- Includes password hashing hooks for secure storage
- Provides a `validatePassword` method for authentication

#### Donor Model (`models/donor.js`)
- Represents the `donors` table in the database
- Has fields: id, user_id, blood_type, location, phone_number, last_donation_date, is_available
- Includes association with User model (belongsTo relationship)

### 2. Migrations

#### Create Users Table (`migrations/20250526032623-create-users-table.js`)
- Creates the users table with appropriate columns and constraints

#### Create Donors Table (`migrations/20250526032510-create-donors-table.js`)
- Creates the donors table with appropriate columns and constraints
- Includes foreign key relationship to users table

### 3. Seeders

#### Demo Users (`seeders/20250526032722-demo-users.js`)
- Seeds the database with sample user data for testing

#### Demo Donors (`seeders/20250526032818-demo-donors.js`)
- Seeds the database with sample donor data for testing
- Links to the demo users

### 4. Configuration

#### Database Configuration (`config/config.json`)
- Contains database connection settings for development, test, and production environments

#### Sequelize Setup (`database.js`)
- Initializes Sequelize connection
- Syncs models with the database
- Exports models for use throughout the application

### 5. API Integration

#### Authentication (`routes/auth.js`)
- Uses Sequelize models for user registration and login
- Leverages model hooks for password hashing

#### Profile Management (`controllers/profileController.js`)
- Uses Sequelize queries to retrieve and update user profiles

#### Donor Management (`routes/donors.js`)
- Implements advanced Sequelize features:
  - Associations between models (User and Donor)
  - Complex queries with filtering options
  - Transaction support for data integrity

## Benefits of Using Sequelize

1. **Object-Oriented Approach**: Database tables represented as JavaScript classes
2. **Security**: Automatic parameter escaping helps prevent SQL injection
3. **Validation**: Built-in data validation at the model level
4. **Associations**: Easy-to-define relationships between models
5. **Migrations**: Structured approach to database schema evolution
6. **Query Building**: Complex queries without writing raw SQL
7. **Hooks**: Automated behaviors before/after database operations

## Example Usage

### Creating a new user:
```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword',
  role: 'user'
});
```

### Finding donors by blood type:
```javascript
const donors = await Donor.findAll({
  where: { blood_type: 'O+' },
  include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
});
```

### Updating a profile:
```javascript
const [updatedRows] = await User.update(
  { name: 'New Name' },
  { where: { id: userId } }
);
```

## Future Enhancements

- Adding more complex associations (hasMany relationships)
- Implementing soft delete functionality
- Adding transaction support for critical operations
- Creating model scopes for commonly used queries
