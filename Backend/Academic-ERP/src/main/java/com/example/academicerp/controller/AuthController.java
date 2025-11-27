package com.example.academicerp.controller;




import com.example.academicerp.config.JwtProvider;
import com.example.academicerp.exception.AppExceptions.EmailAlreadyExists;
import com.example.academicerp.exception.AppExceptions.JwtTokenNotValid;
import com.example.academicerp.dto.AuthResponseDto;
import com.example.academicerp.dto.LoginRequestDto;
import com.example.academicerp.entity.User;
import com.example.academicerp.repository.UserRepository;
import com.example.academicerp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userDetailsService;
    
    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> createUserHandler(
            @RequestBody java.util.Map<String, String> requestBody) throws Exception {

        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String fullName = requestBody.get("fullName");
        
        // Split fullName into firstName and lastName
        String firstName = "";
        String lastName = "";
        
        if (fullName != null && !fullName.trim().isEmpty()) {
            String[] nameParts = fullName.trim().split("\\s+", 2);
            firstName = nameParts[0];
            lastName = nameParts.length > 1 ? nameParts[1] : "";
        }

        User isEmailExist = userRepository.findByEmail(email).orElse(null);

        if (isEmailExist!=null) {

            throw new EmailAlreadyExists("Email Is Already Used With Another Account");
        }

        // Assign role based on email prefix
        // Users with email starting with "department." get ROLE_ADMIN
        // All other users get ROLE_USER
        String role = email.startsWith("department.") ? "ROLE_ADMIN" : "ROLE_USER";
        
        // Create new user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFirstName(firstName);
        createdUser.setLastName(lastName);
        createdUser.setPassword(passwordEncoder.encode(password));
        createdUser.setRole(role);
        createdUser.setActive(true);

        User savedUser = userRepository.save(createdUser);


        // Create authentication object with the saved user's email and password
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails, 
            null, 
            userDetails.getAuthorities()
        );
        
        // Generate JWT token
        String token = jwtProvider.generateToken(authentication);
        
        // Create and return response
        AuthResponseDto authResponse = new AuthResponseDto(
            token,
            "Register Success",
            true
        );

        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponseDto> signin(@RequestBody LoginRequestDto loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        try {
            // Authenticate user
            Authentication authentication = authenticate(username, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String token = jwtProvider.generateToken(authentication);
            
            // Create and return response
            AuthResponseDto authResponse = new AuthResponseDto(
                token,
                "Login Success",
                true
            );

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponseDto(null, "Invalid credentials", false));
        }
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        System.out.println("sign in userDetails - " + userDetails);

        if (userDetails == null) {
            System.out.println("sign in userDetails - null " + userDetails);
            throw new JwtTokenNotValid("Invalid credentials");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            System.out.println("sign in userDetails - password not match " + userDetails);
            throw new JwtTokenNotValid("Invalid credentials");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}