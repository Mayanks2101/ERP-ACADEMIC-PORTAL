package com.example.academicerp.exception;
public class EmailAlreadyExists extends RuntimeException {

    private String message;

    public EmailAlreadyExists(){

    }
    public EmailAlreadyExists(String message) {

        super(message);
        this.message = message;
    }
}