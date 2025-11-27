package com.example.academicerp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class AppExceptions {

    public static class EmailAlreadyExists extends RuntimeException {
        public EmailAlreadyExists(String message) {
            super(message);
        }
    }

    public static class JwtTokenNotValid extends RuntimeException {
        public JwtTokenNotValid(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    public static class ResourceInUseException extends RuntimeException {
        public ResourceInUseException(String message) {
            super(message);
        }
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
}
