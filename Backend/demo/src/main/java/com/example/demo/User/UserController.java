package com.example.demo.User;

// UserController interface to define the methods for user registration and login
public interface UserController {
    public boolean registerUser(User user);
    public User loginUser(User user);
}
