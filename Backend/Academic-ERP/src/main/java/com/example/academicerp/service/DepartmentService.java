package com.example.academicerp.service;

import com.example.academicerp.dto.DepartmentRequestDto;
import com.example.academicerp.dto.DepartmentResponseDto;
import com.example.academicerp.entity.Department;

import java.util.List;

public interface DepartmentService {
    DepartmentResponseDto createDepartment(DepartmentRequestDto departmentDto);
    
    DepartmentResponseDto getDepartmentById(Integer id);
    
    List<DepartmentResponseDto> getAllDepartments();
    
    DepartmentResponseDto updateDepartment(Integer id, DepartmentRequestDto departmentDto);
    
    void deleteDepartment(Integer id);
}
