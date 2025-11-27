package com.example.academicerp.service;

import com.example.academicerp.entity.Employee;
import org.springframework.http.ResponseEntity;

public interface EmployeeServiceInterface {
    ResponseEntity<?> addEmployee(Employee employee, String jwt) throws Exception;
    ResponseEntity<?> getEmployeeById(int id, String jwt) throws Exception;
}
