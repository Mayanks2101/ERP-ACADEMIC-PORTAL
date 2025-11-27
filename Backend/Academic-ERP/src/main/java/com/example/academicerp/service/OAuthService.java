package com.example.academicerp.service;

import com.example.academicerp.entity.User;
import com.example.academicerp.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class OAuthService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // Extract user attributes
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        
        // Check if user exists, if not create a new one
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(name);
                    newUser.setActive(true);
                    // Assign role based on email prefix
                    String role = email.startsWith("department.") ? "ROLE_ADMIN" : "ROLE_USER";
                    newUser.setRole(role);
                    // You might want to set a random password for OAuth users
                    newUser.setPassword(""); // OAuth users won't use password
                    return userRepository.save(newUser);
                });

        return oauth2User;
    }
}
