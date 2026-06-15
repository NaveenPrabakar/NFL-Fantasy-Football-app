package com.example.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// This class is responsible for managing user settings and profile updates. It provides methods to change the user's password, email, and name. The updateUserProfile method takes a User object and a string indicating which field has changed, and it updates the corresponding field in the database using the UserRepo. The class ensures that the user's profile is updated correctly and provides feedback on the success of the operation.
@Service
public class Settings  {

    @Autowired(required = false)
    private UserRepo userRepo;

    public Settings() {
    }

    /**
     * Changes the password for the given user.
     * @param user The user object.
     * @param newPassword The new password.
     * @return A boolean indicating whether the password change was successful.
     */
    private boolean changePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        userRepo.save(user);
        System.out.println("Password changed successfully.");
        return true;
    }

    /**
     * Changes the email for the given user.
     * @param user The user object.
     * @param newEmail The new email.
     * @return A boolean indicating whether the email change was successful.
     */
    private boolean changeEmail(User user, String newEmail) {
        user.setEmail(newEmail);
        System.out.println("Email changed successfully.");
        return true;
    }

    /**
     * Changes the name for the given user.
     * @param user The user object.
     * @param newName The new name.
     * @return A boolean indicating whether the name change was successful.
     */
    private boolean changeName(User user, String newName) {
        user.setName(newName);
        System.out.println("Name changed successfully.");
        return true;
    }

    /**
     * Updates the user's profile based on the specified field that has changed. It retrieves the existing user from the database using the email, checks which field has changed, and calls the appropriate method to update that field. Finally, it saves the updated user back to the database and provides feedback on the success of the operation.
     * @param user
     * @param whatChanged
     * @return
     */
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