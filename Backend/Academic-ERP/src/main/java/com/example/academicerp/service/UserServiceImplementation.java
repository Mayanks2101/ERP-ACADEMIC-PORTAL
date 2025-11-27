package com.example.academicerp.service;

import com.example.academicerp.config.JwtProvider;
import com.example.academicerp.entity.User;
import com.example.academicerp.exception.AppExceptions.JwtTokenNotValid;
import com.example.academicerp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;


    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);


        return userRepository.findByEmail(email)
                .orElseThrow(() -> new JwtTokenNotValid("Invalid credentials"));
    }

    @Override
    public User findUserByEmail(String username) throws Exception {

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new JwtTokenNotValid("Invalid credentials"));
    }

}