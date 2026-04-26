package com.statmind.paf.controller;

import com.statmind.paf.model.Role;
import com.statmind.paf.model.User;
import com.statmind.paf.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email already in use"));
        }

        User newUser = new User();
        newUser.setName(request.get("fullName"));
        newUser.setEmail(email);
        newUser.setPassword(request.get("password"));
        newUser.setRole(Role.USER);
        
        userRepository.save(newUser);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        return userRepository.findByEmail(email)
                .map(u -> {
                    if (password != null && password.equals(u.getPassword())) {
                        return ResponseEntity.ok(u);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found")));
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