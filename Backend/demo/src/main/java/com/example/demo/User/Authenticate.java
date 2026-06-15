package com.example.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// This class is responsible for handling user authentication and registration. It implements the UserController interface, which defines the methods for registering a new user and logging in an existing user. The Authenticate class uses the UserRepo to interact with the database and perform the necessary operations for user management. The registerUser method checks if the email is already registered before saving a new user, while the loginUser method verifies the email and password combination to authenticate the user. If authentication is successful, it returns the user object with the password set to null for security reasons.
@Service
public class Authenticate implements UserController {

    @Autowired(required = false)
    private UserRepo userRepo;

    public Authenticate() {
    }

    public Authenticate(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * @param user The user object containing the email and password for registration.
     * @return A boolean indicating whether the registration was successful or not. It returns false if
     */
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

    /**
     * @param user The user object containing the email and password for login.
     * @return The authenticated user object if the login is successful, or null if the email
     */
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
