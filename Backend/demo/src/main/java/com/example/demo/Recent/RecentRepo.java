package com.example.demo.Recent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RecentRepo extends JpaRepository<Recent, Long>{

    @Query("Select r from recent r where r.user.id = :user_id order by r.timestamp desc")
    List<Recent> findByRecentActivity(Long user_id);

    void deleteById(Long id);
}
