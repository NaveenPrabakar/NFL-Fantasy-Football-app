package com.example.demo.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SettingsTest {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private Settings settings;

    @BeforeEach
    public void setUp() {
        userRepo.deleteAll();
    }

    @Test
    public void testUpdateNameSuccess() {
        User user = new User("Alice", "alice@example.com", "password123");
        userRepo.save(user);

        User updatedUser =
                new User("Alice Smith", "alice@example.com", "password123");

        assertTrue(settings.updateUserProfile(updatedUser, "name"));

        User result = userRepo.findByEmail("alice@example.com");
        assertNotNull(result);
        assertEquals("Alice Smith", result.getName());
    }

    @Test
    public void testUpdatePasswordSuccess() {
        User user = new User("Bob", "bob@example.com", "oldPassword");
        userRepo.save(user);

        User updatedUser =
                new User("Bob", "bob@example.com", "newPassword");

        assertTrue(settings.updateUserProfile(updatedUser, "password"));

        User result = userRepo.findByEmail("bob@example.com");
        assertNotNull(result);
        assertEquals("newPassword", result.getPassword());
    }

    @Test
    public void testUpdateEmailSuccess() {
        User user = new User("Carol", "carol@example.com", "password");
        userRepo.save(user);

        User updatedUser =
                new User("Carol", "carol@example.com", "password");

        assertTrue(settings.updateUserProfile(updatedUser, "email"));

        User result = userRepo.findByEmail("carol@example.com");
        assertNotNull(result);
        assertEquals("carol@example.com", result.getEmail());
    }

    @Test
    public void testUserNotFound() {
        User nonExistent =
                new User("Dave", "dave@example.com", "password");

        assertFalse(settings.updateUserProfile(nonExistent, "name"));
    }

    @Test
    public void testInvalidField() {
        User user = new User("Eve", "eve@example.com", "password");
        userRepo.save(user);

        User updatedUser =
                new User("Eve Updated", "eve@example.com", "password");

        assertFalse(settings.updateUserProfile(updatedUser, "age"));

        User result = userRepo.findByEmail("eve@example.com");
        assertEquals("Eve", result.getName());
    }

    @Test
    public void testCaseSensitiveFieldName() {
        User user = new User("Frank", "frank@example.com", "password");
        userRepo.save(user);

        User updatedUser =
                new User("Frank Updated", "frank@example.com", "password");

        assertFalse(settings.updateUserProfile(updatedUser, "Name"));

        User result = userRepo.findByEmail("frank@example.com");
        assertEquals("Frank", result.getName());
    }

    @Test
    public void testEmptyFieldName() {
        User user = new User("Grace", "grace@example.com", "password");
        userRepo.save(user);

        User updatedUser =
                new User("Grace Updated", "grace@example.com", "password");

        assertFalse(settings.updateUserProfile(updatedUser, ""));

        User result = userRepo.findByEmail("grace@example.com");
        assertEquals("Grace", result.getName());
    }

    @Test
    public void testNullFieldName() {
        User user = new User("Henry", "henry@example.com", "password");
        userRepo.save(user);

        User updatedUser =
                new User("Henry Updated", "henry@example.com", "password");

        assertThrows(
                NullPointerException.class,
                () -> settings.updateUserProfile(updatedUser, null)
        );
    }
}