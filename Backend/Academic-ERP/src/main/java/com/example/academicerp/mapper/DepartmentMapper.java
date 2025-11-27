package com.example.academicerp.mapper;

import com.example.academicerp.dto.DepartmentRequestDto;
import com.example.academicerp.dto.DepartmentResponseDto;
import com.example.academicerp.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);
    
    default Department toEntity(DepartmentRequestDto dto) {
        if (dto == null) {
            return null;
        }
        
        Department department = new Department();
        department.setName(dto.getName());
        department.setCapacity(dto.getCapacity());
        return department;
    }
    
    default DepartmentResponseDto toDto(Department entity) {
        if (entity == null) {
            return null;
        }
        
        DepartmentResponseDto dto = new DepartmentResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCapacity(entity.getCapacity());
        return dto;
    }
    
    default void updateDepartmentFromDto(DepartmentRequestDto dto, @MappingTarget Department entity) {
        if (dto == null) {
            return;
        }
        
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getCapacity() != null) {
            entity.setCapacity(dto.getCapacity());
        }
    }
}
