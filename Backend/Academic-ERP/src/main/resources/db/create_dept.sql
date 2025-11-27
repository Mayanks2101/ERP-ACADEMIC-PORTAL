show databases;
create database if not exists department_management;
use department_management;


CREATE TABLE IF NOT EXISTS departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    emp_count INT NOT NULL DEFAULT 0
);


CREATE TABLE employees (
    emp_id INT auto_increment PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON delete set null
);




SET SQL_SAFE_UPDATES = 0;

UPDATE departments
SET emp_count = (
    SELECT COUNT(*)
    FROM employees
    WHERE employees.dept_id = departments.dept_id
);

DELIMITER //
create trigger after_employee_insert
after insert on employees
for each row
begin
    update departments
    set emp_count = emp_count + 1
    where dept_id = new.dept_id;
end;
//
DELIMITER ;

