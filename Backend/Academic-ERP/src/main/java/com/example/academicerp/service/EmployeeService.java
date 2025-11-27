package com.example.academicerp.service;

import com.example.academicerp.dto.EmployeeRequestDto;
import com.example.academicerp.dto.EmployeeResponseDto;
import com.example.academicerp.entity.Department;
import com.example.academicerp.entity.Employee;
import com.example.academicerp.exception.AppExceptions.JwtTokenNotValid;
import com.example.academicerp.exception.AppExceptions.ResourceNotFoundException;
import com.example.academicerp.mapper.EmployeeMapper;
import com.example.academicerp.repository.DepartmentRepository;
import com.example.academicerp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService implements EmployeeServiceInterface {
    
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    public ResponseEntity<?> addEmployee(Employee employee, String jwt) throws Exception {
        if (jwt == null) {
            throw new JwtTokenNotValid("JWT token is required");
        }
        
        // If department is provided, make sure it exists and is properly set
        if (employee.getDepartment() != null && employee.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(employee.getDepartment().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + employee.getDepartment().getId()));
            employee.setDepartment(department);
        }
        
        // Save to database
        Employee savedEmployee = employeeRepository.save(employee);
        
        // Refresh the entity to ensure all relationships are loaded
        // Using Integer.valueOf() to ensure we're using the correct type
        savedEmployee = employeeRepository.findById(Integer.valueOf(savedEmployee.getId()))
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found after save"));
        
        // Map to DTO for response
        EmployeeResponseDto responseDto = employeeMapper.toDto(savedEmployee);
        
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
    
    // New method that accepts DTO
    public ResponseEntity<?> addEmployee(EmployeeRequestDto employeeDto, String jwt) throws Exception {
        if (jwt == null) {
            throw new JwtTokenNotValid("JWT token is required");
        }
        
        // Map DTO to entity
        Employee employee = employeeMapper.toEntity(employeeDto);
        
        // Delegate to the interface method
        return addEmployee(employee, jwt);
    }

    @Override
    public ResponseEntity<?> getEmployeeById(int id, String jwt) throws Exception {
        if (jwt == null) {
            throw new JwtTokenNotValid("JWT token is required");
        }
        
        Optional<Department> departmentOpt = departmentRepository.findById(id);
        if (departmentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        
        List<Employee> employees = employeeRepository.findByDepartment(departmentOpt.get());
        List<EmployeeResponseDto> responseDtos = employees.stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }
    
    
    // Additional method to get all employees
    public List<EmployeeResponseDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get employees by department ID
    public ResponseEntity<?> getEmployeesByDepartmentId(Integer departmentId) {
        Optional<Department> departmentOpt = departmentRepository.findById(departmentId);
        if (departmentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Department not found with id: " + departmentId);
        }
        
        List<Employee> employees = employeeRepository.findByDepartment(departmentOpt.get());
        List<EmployeeResponseDto> responseDtos = employees.stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }
}
