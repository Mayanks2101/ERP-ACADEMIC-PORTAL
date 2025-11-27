package com.example.academicerp.exception;

public class JwtTokenNotValid extends RuntimeException {

    private String message;

    public JwtTokenNotValid(){

    }
    public JwtTokenNotValid(String message) {

        super(message);
        this.message = message;
    }
}
