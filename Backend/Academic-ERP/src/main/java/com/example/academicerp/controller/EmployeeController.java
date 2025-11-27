package com.example.academicerp.controller;

import com.example.academicerp.exception.JwtTokenNotValid;
import com.example.academicerp.entity.Employee;
import com.example.academicerp.entity.User;
import jakarta.validation.Valid;
import com.example.academicerp.service.EmployeeService;
import com.example.academicerp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.example.academicerp.dto.EmployeeRequestDto;
import com.example.academicerp.mapper.EmployeeMapper;

@CrossOrigin(origins = "http://localhost:3000") @RestController
@RequestMapping("api/emp")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmployeeMapper employeeMapper;


    @PostMapping("add")
    public ResponseEntity<?> addEmployee(
            @Valid @RequestBody EmployeeRequestDto employeeDto,
            @RequestHeader("Authorization") String jwt) throws Exception {
                
        if (jwt == null) {
            throw new JwtTokenNotValid("JWT token is required");
        }
        
        User user = userService.findUserProfileByJwt(jwt);
        if (user == null || !user.getRole().equals("ROLE_ERP_ADMIN")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Convert DTO to entity using the mapper
        Employee employee = employeeMapper.toEntity(employeeDto);
        return employeeService.addEmployee(employee, jwt);
    }

    @GetMapping("getEmpById/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable int id,@RequestHeader("Authorization") String jwt) throws Exception {
        if(jwt==null){
            throw new JwtTokenNotValid("jwt required...");
        }
        User user=userService.findUserProfileByJwt(jwt);

        if(user==null || !user.getRole().equals("ROLE_ERP_ADMIN")){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return employeeService.getEmployeeById(id, jwt);
    }
}
