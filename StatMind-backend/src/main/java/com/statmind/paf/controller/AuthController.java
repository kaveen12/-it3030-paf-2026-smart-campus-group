package com.statmind.paf.controller;

import com.statmind.paf.model.Role;
import com.statmind.paf.model.User;
import com.statmind.paf.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
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