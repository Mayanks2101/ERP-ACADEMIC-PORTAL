package com.example.academicerp.controller;

import com.example.academicerp.config.JwtProvider;
import com.example.academicerp.dto.AuthResponseDto;
import com.example.academicerp.entity.User;
import com.example.academicerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/oauth2")
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final String frontendUrl;

    public OAuth2Controller(UserRepository userRepository,
                            JwtProvider jwtProvider,
                            @Value("${app.frontend-url}") String frontendUrl) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/success")
    public RedirectView oauth2Success() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");

            // Generate JWT token with actual email (not Google user ID)
            String token = jwtProvider.generateToken(authentication, email);

            // Redirect to frontend with token
            // Split frontendUrl to handle multiple origins (e.g., localhost, network IP)
            String targetUrl = frontendUrl.split(",")[0]; 
            return new RedirectView(targetUrl + "/oauth2/redirect?token=" + token + "&email=" + email);
        }
        String targetUrl = frontendUrl.split(",")[0];
        return new RedirectView(targetUrl + "/login?error=oauth_failed");
    }

    @GetMapping("/failure")
    public RedirectView oauth2Failure() {
        String targetUrl = frontendUrl.split(",")[0];
        return new RedirectView(targetUrl + "/login?error=oauth_failed");
    }
}
