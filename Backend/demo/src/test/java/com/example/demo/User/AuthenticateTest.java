package com.example.demo.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AuthenticateTest {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private Authenticate auth;

    @BeforeEach
    public void setUp() {
        userRepo.deleteAll();
    }

    @Test
    public void testRegisterAndLoginSuccess() {
        User alice = new User("Alice", "alice@example.com", "password123");

        assertTrue(auth.registerUser(alice));
        assertTrue(auth.loginUser(
                new User(null, "alice@example.com", "password123")));
    }

    @Test
    public void testRegisterDuplicateEmail() {
        User bob = new User("Bob", "bob@example.com", "pwd");

        assertTrue(auth.registerUser(bob));
        assertFalse(auth.registerUser(
                new User("Bobby", "bob@example.com", "pwd2")));

        assertTrue(auth.loginUser(
                new User(null, "bob@example.com", "pwd")));

        assertFalse(auth.loginUser(
                new User(null, "bob@example.com", "pwd2")));
    }

    @Test
    public void testLoginWrongPassword() {
        auth.registerUser(
                new User("Carol", "carol@example.com", "s3cr3t"));

        assertFalse(auth.loginUser(
                new User(null, "carol@example.com", "wrongpass")));
    }

    @Test
    public void testLoginUnknownEmail() {
        assertFalse(auth.loginUser(
                new User(null, "unknown@example.com", "password")));
    }

    @Test
    public void testRegisterMultipleUsers() {
        assertTrue(auth.registerUser(
                new User("Alice", "alice@example.com", "a")));

        assertTrue(auth.registerUser(
                new User("Bob", "bob@example.com", "b")));

        assertTrue(auth.registerUser(
                new User("Carol", "carol@example.com", "c")));

        assertEquals(3, userRepo.count());
    }

    @Test
    public void testLoginCorrectUserWrongUsersPassword() {
        auth.registerUser(
                new User("Alice", "alice@example.com", "alicepass"));

        auth.registerUser(
                new User("Bob", "bob@example.com", "bobpass"));

        assertFalse(auth.loginUser(
                new User(null, "alice@example.com", "bobpass")));
    }

    @Test
    public void testUserActuallySavedAfterRegistration() {
        User user = new User(
                "David",
                "david@example.com",
                "password");

        auth.registerUser(user);

        User savedUser =
                userRepo.findByEmail("david@example.com");

        assertNotNull(savedUser);
        assertEquals("David", savedUser.getName());
        assertEquals("david@example.com", savedUser.getEmail());
        assertEquals("password", savedUser.getPassword());
    }

    @Test
    public void testDuplicateEmailDoesNotCreateSecondUser() {
        auth.registerUser(
                new User("Eve", "eve@example.com", "pass1"));

        auth.registerUser(
                new User("Eve2", "eve@example.com", "pass2"));

        assertEquals(1, userRepo.count());
    }

    @Test
    public void testLoginAfterDuplicateRegistrationAttempt() {
        auth.registerUser(
                new User("Frank", "frank@example.com", "original"));

        auth.registerUser(
                new User("Frank2", "frank@example.com", "newpass"));

        assertTrue(auth.loginUser(
                new User(null, "frank@example.com", "original")));

        assertFalse(auth.loginUser(
                new User(null, "frank@example.com", "newpass")));
    }
}