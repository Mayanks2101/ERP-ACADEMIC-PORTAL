package com.example.academicerp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepartmentRequestDto {
    @NotBlank(message = "Department name is required")
    private String name;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Override
    public String toString() {
        return "DepartmentRequestDto{" +
                "name='" + name + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}
