package com.example.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class Authenticate implements UserController {

    @Autowired(required = false)
    private UserRepo userRepo;

    // Fallback in-memory store used when running outside Spring tests
    private final List<User> inMemoryUsers = new ArrayList<>();

    // Package-visible constructor for tests to inject a repo if desired
    public Authenticate() {
    }

    public Authenticate(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public boolean registerUser(User user) {
        if (userRepo != null) {
            if (userRepo.findByEmail(user.getEmail()) != null) {
                System.out.println("Email already registered.");
                return false;
            }
            userRepo.save(user);
            System.out.println("User registered successfully.");
            return true;
        }

        // Fallback behaviour for in-memory tests
        for (User u : inMemoryUsers) {
            if (u.getEmail().equals(user.getEmail())) {
                System.out.println("Email already registered.");
                return false;
            }
        }
        inMemoryUsers.add(user);
        System.out.println("User registered successfully (in-memory).");
        return true;
    }

    @Override
    public boolean loginUser(User user) {
        if (userRepo != null) {
            User existingUser = userRepo.findByEmail(user.getEmail());
            if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
                System.out.println("Login successful.");
                return true;
            }
            System.out.println("Invalid email or password.");
            return false;
        }

        // Fallback behaviour for in-memory tests
        for (User u : inMemoryUsers) {
            if (u.getEmail().equals(user.getEmail()) && u.getPassword().equals(user.getPassword())) {
                System.out.println("Login successful (in-memory).");
                return true;
            }
        }
        System.out.println("Invalid email or password.");
        return false;
    }

}
