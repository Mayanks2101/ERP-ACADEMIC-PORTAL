# Academic ERP - Database Setup

## Overview
This directory contains SQL scripts to set up the Academic ERP database schema and sample data. The database consists of three main tables that handle user authentication, department information, and employee records.

## Database Schema

### Tables
- **users**: Manages user authentication and profile information
  - Stores credentials, names, and role-based access control
  
- **department**: Contains department information
  - Tracks department names and their capacities
  
- **employee**: Manages employee records
  - Links employees to their respective departments
  - Stores contact and role information

## Setup Instructions

### Prerequisites
- MySQL Server installed and running
- MySQL client/command line tool
- Database user with appropriate permissions

### 1. Create Database and Schema
Run the schema creation script:
```bash
mysql -u root -p < create_schema.sql
```

### 2. Insert Sample Data (Optional)
To populate the database with sample data for testing:

```bash
# Insert all sample data (departments, employees, and users)
mysql -u root -p new_academic_erp < insert_data.sql
```

### 3. Spring Boot Auto-Configuration (Alternative)
The application can automatically handle database setup using JPA:
1. Ensure the database exists:
   ```sql
   CREATE DATABASE new_academic_erp;
   ```
2. The `application.properties` is configured with:
   ```properties
   spring.jpa.properties.hibernate.hbm2ddl.auto=update
   ```
3. Start the application - tables will be created/updated automatically

## Test Users

After running `insert_data.sql`, you can log in with these test accounts:

### Admin User
- **Email:** `department.admin@university.edu`  
- **Password:** `password123`  
- **Role:** `ROLE_ADMIN`  
- **Permissions:** Full CRUD operations on all resources

### Regular Users
- **Email:** `john.doe@university.edu`  
  **Password:** `password123`  
  **Role:** `ROLE_USER`
  
- **Email:** `jane.smith@university.edu`  
  **Password:** `password123`  
  **Role:** `ROLE_USER`

## Role-Based Access Control

- Users with email starting with `department.` get **ROLE_ADMIN** (full CRUD access)
- All other users get **ROLE_USER** (read-only access)

## Notes
- All authentication is now handled through the `users` table
- Passwords are stored as BCrypt hashes
- The schema uses InnoDB engine with UTF-8 encoding
