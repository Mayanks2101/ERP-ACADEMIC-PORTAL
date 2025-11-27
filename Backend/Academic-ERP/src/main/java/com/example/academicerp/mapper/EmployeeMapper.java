package com.example.academicerp.mapper;

import com.example.academicerp.dto.EmployeeRequestDto;
import com.example.academicerp.dto.EmployeeResponseDto;
import com.example.academicerp.entity.Department;
import com.example.academicerp.entity.Employee;
import com.example.academicerp.exception.AppExceptions.ResourceNotFoundException;
import com.example.academicerp.repository.DepartmentRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class EmployeeMapper {

    @Autowired
    protected DepartmentRepository departmentRepository;

    public Employee toEntity(EmployeeRequestDto dto) {
        if (dto == null) {
            return null;
        }
        
        Employee employee = new Employee();
        employee.setEmail(dto.getEmail());
        employee.setName(dto.getName());
        employee.setTitle(dto.getTitle());
        
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            employee.setDepartment(department);
        }
        
        return employee;
    }
    
    public EmployeeResponseDto toDto(Employee entity) {
        if (entity == null) {
            return null;
        }
        
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setName(entity.getName());
        dto.setTitle(entity.getTitle());
        
        if (entity.getDepartment() != null) {
            dto.setDepartmentId(entity.getDepartment().getId());
            dto.setDepartmentName(entity.getDepartment().getName());
        }
        
        return dto;
    }
    
    public void updateEmployeeFromDto(EmployeeRequestDto dto, @MappingTarget Employee entity) {
        if (dto == null) {
            return;
        }
        
        if (dto.getEmail() != null) {
            entity.setEmail(dto.getEmail());
        }
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getTitle() != null) {
            entity.setTitle(dto.getTitle());
        }
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            entity.setDepartment(department);
        }
    }
}
