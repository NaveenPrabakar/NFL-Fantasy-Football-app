package com.example.demo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

// This interface defines the repository for the User entity. It extends JpaRepository, which provides basic CRUD operations for the User entity. The UserRepo interface also includes a method to find a user by their email and a method to delete a user by their email. The @Modifying and @Transactional annotations are used to indicate that the deleteByEmail method modifies the database and should be executed within a transaction.
public interface UserRepo extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.email = ?1")
    void deleteByEmail(String email);
    
}
