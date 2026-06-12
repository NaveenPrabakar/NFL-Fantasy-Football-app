package com.example.demo.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AuthenticateTest {

    private Authenticate auth;

    @BeforeEach
    public void setUp() {
        auth = new Authenticate();
    }

    @Test
    public void testRegisterAndLoginSuccess() {
        User alice = new User("Alice", "alice@example.com", "password123");
        auth.registerUser(alice);
        assertTrue(auth.loginUser(new User(null, "alice@example.com", "password123")));
    }

    @Test
    public void testRegisterDuplicateEmail() {
        User bob = new User("Bob", "bob@example.com", "pwd");
        auth.registerUser(bob);
        // second registration with same email should not add a new user
        auth.registerUser(new User("Bobby", "bob@example.com", "pwd2"));
        // original credentials should still work
        assertTrue(auth.loginUser(new User(null, "bob@example.com", "pwd")));
        // wrong password should fail
        assertFalse(auth.loginUser(new User(null, "bob@example.com", "pwd2")));
    }

    @Test
    public void testLoginFailWrongPasswordOrUnknownEmail() {
        auth.registerUser(new User("Carol", "carol@example.com", "s3cr3t"));
        assertFalse(auth.loginUser(new User(null, "carol@example.com", "wrongpass")));
        assertFalse(auth.loginUser(new User(null, "unknown@example.com", "whatever")));
    }
}
