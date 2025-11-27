package com.example.academicerp.service;

import com.example.academicerp.config.JwtProvider;
import com.example.academicerp.entity.User;
import com.example.academicerp.exception.AppExceptions.JwtTokenNotValid;
import com.example.academicerp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public User findUserProfileByJwt(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new JwtTokenNotValid("Invalid credentials"));
    }

    public User findUserByEmail(String username) throws Exception {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new JwtTokenNotValid("Invalid credentials"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority(user.getRole()));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActive(),
                true, true, true,
                authorities
        );
    }
}