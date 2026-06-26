package com.example.demo.API;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.User.User;

import com.example.demo.User.Authenticate;
import com.example.demo.User.Settings;


@RestController
@RequestMapping("/user")
public class UserAPI {

    private final Authenticate authenticate;
    private final Settings settings;

    public UserAPI(Authenticate authenticate, Settings settings) {
        this.authenticate = authenticate;
        this.settings = settings;
    }
    
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        
        boolean isRegistered = authenticate.registerUser(user);

        if (!isRegistered) {
            return "Email already registered.";
        }
        return "User registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        User loggedIn = authenticate.loginUser(user);

        if (loggedIn == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(loggedIn);
    }

    @PutMapping("/update")
    public String updateUserProfile(@RequestBody User user, @RequestParam String currentEmail, @RequestParam String whatChanged) {

    
        boolean isUpdated = settings.updateUserProfile(user, currentEmail, whatChanged);
        if (!isUpdated) {
            return "Failed to update user profile.";
        }
        return "User profile updated successfully.";
    }
}
