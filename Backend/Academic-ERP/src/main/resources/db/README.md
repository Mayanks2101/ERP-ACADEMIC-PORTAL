# Database Setup Instructions

## Overview
This directory contains SQL scripts to set up the Academic ERP database schema and sample data.

## Database Schema
The application uses three main tables:
- **users**: Stores user authentication and profile information
- **department**: Stores department information
- **employee**: Stores employee information linked to departments

## Setup Instructions

### 1. Create Database and Schema
Run the schema creation script:
```bash
mysql -u root -p < 01_create_schema.sql
```

### 2. Insert Sample Data (Optional)
If you want to start with sample data for testing:

```bash
# Insert departments
mysql -u root -p new_academic_erp < 02_insert_departments.sql

# Insert employees
mysql -u root -p new_academic_erp < 03_insert_employees.sql

# Insert test users
mysql -u root -p new_academic_erp < 04_insert_users.sql
```

### 3. Using Spring Boot Auto-Configuration
Alternatively, you can let Spring Boot create the tables automatically:
- The `application.properties` file has `spring.jpa.properties.hibernate.hbm2ddl.auto=update`
- This will automatically create/update tables based on your JPA entities
- You only need to create the database: `CREATE DATABASE new_academic_erp;`

## Test Users

After running `04_insert_users.sql`, you can login with:

**Admin User** (has CRUD permissions):
- Email: `department.admin@university.edu`
- Password: `password123`
- Role: ROLE_ADMIN

**Regular Users** (read-only):
- Email: `john.doe@university.edu` or `jane.smith@university.edu`
- Password: `password123`
- Role: ROLE_USER

## Role-Based Access Control

- Users with email starting with `department.` get **ROLE_ADMIN** (full CRUD access)
- All other users get **ROLE_USER** (read-only access)

## Notes

- The old `erp_admin` table has been removed
- All authentication is now handled through the `users` table
- Passwords are stored as BCrypt hashes
- The schema uses InnoDB engine with UTF-8 encoding
