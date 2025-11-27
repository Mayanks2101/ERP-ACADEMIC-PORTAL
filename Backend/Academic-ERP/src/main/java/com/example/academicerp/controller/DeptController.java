package com.example.academicerp.controller;
import com.example.academicerp.config.AppConfig;
import jakarta.servlet.http.HttpServletRequest;

import com.example.academicerp.dto.DepartmentRequestDto;
import com.example.academicerp.dto.DepartmentResponseDto;
import com.example.academicerp.exception.AppExceptions.JwtTokenNotValid;
import com.example.academicerp.service.DepartmentService;
import com.example.academicerp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing departments.
 * Requires ADMIN role for all operations.
 */
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DeptController {

    private final DepartmentService departmentService;
    private final UserService userService;

    /**
     * Create a new department
     * @param departmentDto Department data to create
     * @param jwt JWT token for authentication
     * @return Created department
     * @throws Exception if user is not authorized
     */
    private final AppConfig appConfig;

    /**
     * Create a new department
     * @param departmentDto Department data to create
     * @param request HttpServletRequest to get header
     * @return Created department
     * @throws Exception if user is not authorized
     */
    @PostMapping
    public ResponseEntity<DepartmentResponseDto> createDepartment(
            @Valid @RequestBody DepartmentRequestDto departmentDto,
            HttpServletRequest request) throws Exception {
        
        String jwt = request.getHeader(appConfig.getJwtHeader());
        
        validateAdminAccess(jwt);
        DepartmentResponseDto createdDepartment = departmentService.createDepartment(departmentDto);
        return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
    }

    /**
     * Get a department by ID
     * @param id Department ID
     * @param jwt JWT token for authentication
     * @return Requested department
     * @throws Exception if department not found or user is not authorized
     */
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponseDto> getDepartmentById(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        validateAdminAccess(jwt);
        DepartmentResponseDto department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    /**
     * Get all departments
     * @param jwt JWT token for authentication
     * @return List of all departments
     * @throws Exception if user is not authorized
     */
    @GetMapping
    public ResponseEntity<List<DepartmentResponseDto>> getAllDepartments(
            @RequestHeader("Authorization") String jwt) throws Exception {
            
        // Allow all authenticated users to view departments (read-only)
        userService.findUserProfileByJwt(jwt); // Just validate token
        List<DepartmentResponseDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * Update a department
     * @param id Department ID to update
     * @param departmentDto Updated department data
     * @param jwt JWT token for authentication
     * @return Updated department
     * @throws Exception if department not found or user is not authorized
     */
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDto> updateDepartment(
            @PathVariable Integer id,
            @Valid @RequestBody DepartmentRequestDto departmentDto,
            @RequestHeader("Authorization") String jwt) throws Exception {
            
        validateAdminAccess(jwt);
        DepartmentResponseDto updatedDepartment = departmentService.updateDepartment(id, departmentDto);
        return ResponseEntity.ok(updatedDepartment);
    }

    /**
     * Delete a department
     * @param id Department ID to delete
     * @param jwt JWT token for authentication
     * @throws Exception if department not found or user is not authorized
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDepartment(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String jwt) throws Exception {
            
        validateAdminAccess(jwt);
        departmentService.deleteDepartment(id);
    }
    
    /**
     * Validates if the JWT token belongs to an admin user
     * @param jwt JWT token to validate
     * @throws JwtTokenNotValid if token is invalid or user is not an admin
     */
    private void validateAdminAccess(String jwt) throws Exception {
        if (jwt == null) {
            throw new JwtTokenNotValid("JWT token is required");
        }
        
        var user = userService.findUserProfileByJwt(jwt);
        // Check for ROLE_ADMIN or ROLE_ERP_ADMIN (backward compatibility)
        if (user == null || 
            (!"ROLE_ADMIN".equals(user.getRole()) && !"ROLE_ERP_ADMIN".equals(user.getRole()))) {
            throw new JwtTokenNotValid("Access denied. Admin privileges required.");
        }
    }
}
