package com.example.demo.API;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.User.User;

import com.example.demo.User.UserController;
import com.example.demo.User.Authenticate;


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
}
