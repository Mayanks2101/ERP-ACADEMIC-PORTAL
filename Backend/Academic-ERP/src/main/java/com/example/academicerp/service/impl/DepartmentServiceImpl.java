package com.example.academicerp.service.impl;

import com.example.academicerp.dto.DepartmentRequestDto;
import com.example.academicerp.dto.DepartmentResponseDto;
import com.example.academicerp.entity.Department;
import com.example.academicerp.exception.ResourceInUseException;
import com.example.academicerp.exception.ResourceNotFoundException;
import com.example.academicerp.mapper.DepartmentMapper;
import com.example.academicerp.repository.DepartmentRepository;
import com.example.academicerp.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public DepartmentResponseDto createDepartment(DepartmentRequestDto departmentDto) {
        System.out.println("1. Received DTO: " + departmentDto);
        
        // Map DTO to entity
        Department department = departmentMapper.toEntity(departmentDto);
        System.out.println("2. Mapped to entity - Name: " + department.getName() + 
                         ", Capacity: " + department.getCapacity());
        
        // Save to database
        Department savedDepartment = departmentRepository.save(department);
        System.out.println("3. Saved department - ID: " + savedDepartment.getId() + 
                         ", Name: " + savedDepartment.getName() + 
                         ", Capacity: " + savedDepartment.getCapacity());
        
        // Map back to DTO
        DepartmentResponseDto responseDto = departmentMapper.toDto(savedDepartment);
        System.out.println("4. Mapped to response DTO - ID: " + responseDto.getId() + 
                         ", Name: " + responseDto.getName() + 
                         ", Capacity: " + responseDto.getCapacity());
        
        return responseDto;
    }

    @Override
    public DepartmentResponseDto getDepartmentById(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return departmentMapper.toDto(department);
    }

    @Override
    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DepartmentResponseDto updateDepartment(Integer id, DepartmentRequestDto departmentDto) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        departmentMapper.updateDepartmentFromDto(departmentDto, existingDepartment);
        Department updatedDepartment = departmentRepository.save(existingDepartment);
        return departmentMapper.toDto(updatedDepartment);
    }

    @Override
    @Transactional
    public void deleteDepartment(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        // Check if there are any employees in this department
        if (!department.getEmployees().isEmpty()) {
            throw new ResourceInUseException("Cannot delete department with id " + id +
                " because it has " + department.getEmployees().size() + " employees assigned to it");
        }
        
        departmentRepository.delete(department);
    }
}
