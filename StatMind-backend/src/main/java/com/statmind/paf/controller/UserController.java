package com.statmind.paf.controller;

import com.statmind.paf.model.User;
import com.statmind.paf.exception.ResourceNotFoundException;
import com.statmind.paf.model.Role;
import com.statmind.paf.repository.UserRepository;
import com.statmind.paf.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}/role")
    public User updateUserRole(@PathVariable String id,
                           @RequestParam Role role,
                           @RequestParam String currentUserRole) {

    if (!currentUserRole.equals("ADMIN")) {
        throw new RuntimeException("Access denied. Only ADMIN can update roles");
    }

    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    user.setRole(role);
        return userRepository.save(user);
    }
}