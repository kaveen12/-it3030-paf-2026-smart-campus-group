package com.statmind.paf.controller;

import com.statmind.paf.model.Role;
import com.statmind.paf.model.User;
import com.statmind.paf.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.isBlank()) {
            name = request.get("fullName");
        }

        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Name, email and password are required"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already in use"));
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));

        String roleText = request.get("role");
        if (roleText != null && !roleText.isBlank()) {
            newUser.setRole(Role.valueOf(roleText.toUpperCase()));
        } else {
            newUser.setRole(Role.USER);
        }

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        boolean passwordMatches = false;

        if (user.getPassword() != null) {
            if (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$")) {
                passwordMatches = passwordEncoder.matches(password, user.getPassword());
            } else {
                passwordMatches = password.equals(user.getPassword());
            }
        }

        if (!passwordMatches) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");

        if (email == null || email.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Google email is required"));
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(name != null ? name : email.split("@")[0]);
                    newUser.setEmail(email);
                    newUser.setRole(Role.USER);
                    return userRepository.save(newUser);
                });

        return ResponseEntity.ok(user);
    }

    @PostMapping("/demo-login")
    public User demoLogin(@RequestBody User loginUser) {
        return userRepository.findByEmail(loginUser.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(loginUser.getName());
                    newUser.setEmail(loginUser.getEmail());
                    newUser.setRole(Role.USER);
                    return userRepository.save(newUser);
                });
    }
}