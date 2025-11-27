package com.example.academicerp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponseDto {
    private Integer id;
    private String name;
    private Integer capacity;

    @Override
    public String toString() {
        return "DepartmentResponseDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}
