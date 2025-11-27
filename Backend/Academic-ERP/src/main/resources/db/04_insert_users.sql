-- Sample users for testing
-- Insert test users with different roles
-- Note: Passwords are BCrypt hashed versions of "password123"

USE new_academic_erp;

-- Admin user (email starts with "department.")
INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
    ('department.admin@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ROLE_ADMIN', TRUE);

-- Regular users (non-department emails)
INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
    ('john.doe@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'ROLE_USER', TRUE),
    ('jane.smith@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'ROLE_USER', TRUE);

-- Note: All test users have password: "password123"
-- In production, users should set their own passwords during signup
