package com.example.demo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.email = ?1")
    void deleteByEmail(String email);
    
}
