package com.example.academicerp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployeeRequestDto {
    @Email(message = "Email should be valid")
    private String email;
    
    private String name;
    
    private String title;
    
    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @Override
    public String toString() {
        return "EmployeeRequestDto{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", departmentId=" + departmentId +
                '}';
    }
}
