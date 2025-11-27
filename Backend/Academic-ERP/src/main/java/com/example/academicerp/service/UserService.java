package com.example.academicerp.service;


import com.example.academicerp.entity.User;

public interface UserService {

    public User findUserProfileByJwt(String jwt) throws Exception;

    public User findUserByEmail(String email) throws Exception;


}