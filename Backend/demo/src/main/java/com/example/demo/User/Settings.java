package com.example.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Settings  {

    @Autowired(required = false)
    private UserRepo userRepo;

    public Settings() {
    }

    private boolean changePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        userRepo.save(user);
        System.out.println("Password changed successfully.");
        return true;
    }

    private boolean changeEmail(User user, String newEmail) {
        user.setEmail(newEmail);
        System.out.println("Email changed successfully.");
        return true;
    }

    private boolean changeName(User user, String newName) {
        user.setName(newName);
        System.out.println("Name changed successfully.");
        return true;
    }


    public boolean updateUserProfile(User user, String whatChanged) {
        User existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser == null) {
            System.out.println("User not found.");
            return false;
        }
        if (whatChanged.equals("name")) {
            changeName(existingUser, user.getName());
        } else if (whatChanged.equals("password")) {
            changePassword(existingUser, user.getPassword());
        } else if (whatChanged.equals("email")) {
            changeEmail(existingUser, user.getEmail());
        } 
        else {
            System.out.println("Invalid field to update.");
            return false;
        }
        userRepo.save(existingUser);
        System.out.println("User profile updated successfully.");
        return true;
    }
}