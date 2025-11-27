-- ============================================
-- Combined Insert Script for Academic ERP
-- This file combines all data insertion scripts
-- ============================================

-- Set the database context
USE new_academic_erp;

-- ============================================
-- Insert Departments
-- ============================================
INSERT INTO department (name, capacity) VALUES
    ('Administration', 60),
    ('Accounts', 100),
    ('Computer Science', 80),
    ('Electrical Engineering', 50),
    ('Civil Engineering', 30),
    ('Mechanical Engineering', 120),
    ('Biotechnology', 75),
    ('Environmental Science', 40),
    ('Mathematics', 90),
    ('Physics', 110),
    ('Chemistry', 60),
    ('Pharmacy', 85),
    ('Architecture', 95),
    ('Law', 50),
    ('Business Administration', 70),
    ('Economics', 65),
    ('Sociology', 100),
    ('Psychology', 55),
    ('Fine Arts', 40),
    ('Music and Performing Arts', 80);

-- ============================================
-- Insert Employees
-- ============================================
INSERT INTO employee (name, email, title, department_id) VALUES
    ('Alice Johnson', 'admin.head@university.edu', 'Admin Head', 1),
    ('Bob Smith', 'admin.staff@university.edu', 'Admin Assistant', 1),
    ('Charlie Brown', 'accounts.manager@university.edu', 'Accounts Manager', 2),
    ('Eve Davis', 'accounts.clerk@university.edu', 'Accounts Clerk', 2),
    ('Dr. Jane Miller', 'cs.prof@university.edu', 'Professor', 3),
    ('John Wilson', 'cs.assist@university.edu', 'Teaching Assistant', 3),
    ('Dr. Sarah White', 'ee.prof@university.edu', 'Professor', 4),
    ('Chris Taylor', 'ee.assist@university.edu', 'Lab Assistant', 4),
    ('Dr. Mark Green', 'civil.prof@university.edu', 'Professor', 5),
    ('Linda Walker', 'civil.tech@university.edu', 'Technician', 5),
    ('Dr. Emily Harris', 'me.engg.prof@university.edu', 'Professor', 6),
    ('Oliver King', 'me.engg.tech@university.edu', 'Technician', 6),
    ('Dr. Rachel Turner', 'bio.prof@university.edu', 'Professor', 7),
    ('Lucas Scott', 'bio.lab@university.edu', 'Lab Assistant', 7),
    ('Dr. Robert Lee', 'env.sci.prof@university.edu', 'Professor', 8),
    ('Sophie Davis', 'env.sci.assist@university.edu', 'Teaching Assistant', 8),
    ('Dr. William Harris', 'math.prof@university.edu', 'Professor', 9),
    ('Ava Clark', 'math.assist@university.edu', 'Teaching Assistant', 9),
    ('Dr. Daniel White', 'phy.prof@university.edu', 'Professor', 10),
    ('Lily Lewis', 'phy.lab@university.edu', 'Lab Assistant', 10),
    ('Dr. Jack Martinez', 'chem.prof@university.edu', 'Professor', 11),
    ('Mason Taylor', 'chem.lab@university.edu', 'Lab Assistant', 11),
    ('Dr. Sophia Adams', 'pharma.prof@university.edu', 'Professor', 12),
    ('Benjamin Lee', 'pharma.assist@university.edu', 'Teaching Assistant', 12),
    ('Dr. Olivia Walker', 'arch.prof@university.edu', 'Professor', 13),
    ('Matthew Harris', 'arch.assist@university.edu', 'Teaching Assistant', 13),
    ('Dr. Samuel King', 'law.prof@university.edu', 'Professor', 14),
    ('Zoe Green', 'law.assist@university.edu', 'Teaching Assistant', 14),
    ('Dr. Michael Clark', 'ba.prof@university.edu', 'Professor', 15),
    ('Chloe Adams', 'ba.assist@university.edu', 'Teaching Assistant', 15),
    ('Dr. Ethan Martinez', 'eco.prof@university.edu', 'Professor', 16),
    ('Liam Robinson', 'eco.assist@university.edu', 'Teaching Assistant', 16),
    ('Dr. Isabella Scott', 'soc.prof@university.edu', 'Professor', 17),
    ('Emma White', 'soc.assist@university.edu', 'Teaching Assistant', 17),
    ('Dr. James Walker', 'psy.prof@university.edu', 'Professor', 18),
    ('Oliver Brown', 'psy.assist@university.edu', 'Teaching Assistant', 18),
    ('Dr. Mia Davis', 'finearts.prof@university.edu', 'Professor', 19),
    ('Ella Taylor', 'finearts.assist@university.edu', 'Teaching Assistant', 19),
    ('Dr. Noah Harris', 'music.prof@university.edu', 'Professor', 20),
    ('Mia Green', 'music.assist@university.edu', 'Teaching Assistant', 20);

-- ============================================
-- Insert Users
-- Note: Passwords are BCrypt hashed versions of "password123"
-- ============================================
-- Admin user (email starts with "department.")
-- INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
--    ('department.admin@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ROLE_ADMIN', 1);

-- Regular users (non-department emails)
-- INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
--    ('john.doe@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'ROLE_USER', 1),
--    ('jane.smith@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'ROLE_USER', 1);

-- Note: All test users have password: "password123"
-- In production, users should set their own passwords during signup
