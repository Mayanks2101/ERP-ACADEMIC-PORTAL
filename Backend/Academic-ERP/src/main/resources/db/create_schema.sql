-- Academic ERP Database Schema
-- This script creates the complete database schema for the Academic ERP system

-- Create database
CREATE DATABASE IF NOT EXISTS new_academic_erp;
USE new_academic_erp;

-- ============================================
-- Table: users
-- Stores user authentication and profile information
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_active BIT(1) DEFAULT 1,
    role VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: department
-- Stores department information
-- ============================================
CREATE TABLE IF NOT EXISTS department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    capacity INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: employee
-- Stores employee information linked to departments
-- ============================================
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    department_id INT UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Triggers for maintaining data integrity
-- ============================================

-- Trigger to update department capacity count (optional, if needed)
-- Note: This is optional as capacity is now a fixed value, not a count
-- Uncomment if you want to track employee count automatically

/*
DELIMITER //
CREATE TRIGGER after_employee_insert
AFTER INSERT ON employee
FOR EACH ROW
BEGIN
    UPDATE department
    SET capacity = capacity + 1
    WHERE id = NEW.department_id;
END;
//

CREATE TRIGGER after_employee_delete
AFTER DELETE ON employee
FOR EACH ROW
BEGIN
    UPDATE department
    SET capacity = capacity - 1
    WHERE id = OLD.department_id;
END;
//
DELIMITER ;
*/
