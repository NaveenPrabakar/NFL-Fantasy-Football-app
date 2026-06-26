package com.example.demo.Recent;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecentRepo extends JpaRepository<Recent, Long>{

    List<Recent> findTop5ByUser_IdOrderByTimestampDesc(Long userId);
}
