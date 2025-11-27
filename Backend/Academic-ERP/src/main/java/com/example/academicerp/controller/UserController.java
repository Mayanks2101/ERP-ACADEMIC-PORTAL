package com.example.academicerp.controller;



import com.example.academicerp.config.AppConfig;
import jakarta.servlet.http.HttpServletRequest;

import com.example.academicerp.entity.User;
import com.example.academicerp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private AppConfig appConfig;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(
            HttpServletRequest request) throws Exception {

        String jwt = request.getHeader(appConfig.getJwtHeader());

        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }






}