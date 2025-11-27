package com.example.academicerp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalException {



    @ExceptionHandler(value = AppExceptions.JwtTokenNotValid.class)
    public ResponseEntity<ErrorResponse> handleExceptionJwtTokenNotValid(AppExceptions.JwtTokenNotValid tokenNotValid) {
        ErrorResponse er=new ErrorResponse();
        er.setMessage(tokenNotValid.getMessage());
        er.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(er, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = AppExceptions.EmailAlreadyExists.class)
    public ResponseEntity<ErrorResponse> handleExceptionEmailAlreadyExists(AppExceptions.EmailAlreadyExists emailAlreadyExists) {
        ErrorResponse er=new ErrorResponse();
        er.setMessage(emailAlreadyExists.getMessage());
        er.setStatusCode(HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(er, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse er=new ErrorResponse();
        er.setMessage(e.getMessage());
        er.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(er, HttpStatus.INTERNAL_SERVER_ERROR);
    }



}