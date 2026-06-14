package com.example.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Authenticate implements UserController {

    @Autowired(required = false)
    private UserRepo userRepo;

    public Authenticate() {
    }

    public Authenticate(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public boolean registerUser(User user) {

        if (userRepo.findByEmail(user.getEmail()) != null) {
            System.out.println("Email already registered.");
            return false;
        }
        userRepo.save(user);
        System.out.println("User registered successfully.");
        return true;

    }

    @Override
    public User loginUser(User user) {

        User existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            System.out.println("Login successful.");
            existingUser.setPassword(null);
            return existingUser;
        }
        System.out.println("Invalid email or password.");
        return null;

    }

}
