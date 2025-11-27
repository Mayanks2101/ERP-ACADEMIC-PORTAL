package com.example.academicerp.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    // Getters and Setters
    private String jwt;
    private String message;
    private boolean status;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String jwt, String message, boolean status) {
        this.jwt = jwt;
        this.message = message;
        this.status = status;
    }

}
