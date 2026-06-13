package com.example.demo.API;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.User.User;

import com.example.demo.User.UserController;
import com.example.demo.User.Authenticate;
import com.example.demo.User.Settings;


@RestController
@RequestMapping("/user")
public class UserAPI {
    
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        
        UserController userController = new Authenticate();
        boolean isRegistered = userController.registerUser(user);

        if (!isRegistered) {
            return "Email already registered.";
        }
        return "User registered successfully";
    }

    @PostMapping("/login")
    public boolean loginUser(@RequestBody User user) {
        
        UserController userController = new Authenticate();
        boolean isAuthenticated = userController.loginUser(user);

        if (!isAuthenticated) {
            return false;
        }
        return true; 
    }

    @PutMapping("/update")
    public String updateUserProfile(@RequestBody User user, String whatChanged) {

        Settings userSettings = new Settings();
        boolean isUpdated = userSettings.updateUserProfile(user, whatChanged);
        if (!isUpdated) {
            return "Failed to update user profile.";
        }
        return "User profile updated successfully.";
    }
}
