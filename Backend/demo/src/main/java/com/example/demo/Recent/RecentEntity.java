package com.example.demo.Recent;

import com.example.demo.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecentEntity implements RecentController {

    @Autowired(required = false)
    private RecentRepo recentRepo;

    public RecentEntity() {
    }

    public RecentEntity(RecentRepo recentRepo) {
        this.recentRepo = recentRepo;
    }

    @Override
    public boolean addLatestPlayer(User user, String searchedPlayer) {
        
        if(user == null || searchedPlayer == null || searchedPlayer.isEmpty()) {
            return false;
        }

        Recent newRecent = new Recent(user, searchedPlayer, LocalDateTime.now());

        try{
            recentRepo.save(newRecent);
        }catch(Exception e){
            return false;
        }
        return true;
    }

    @Override
    public List<Recent> getLast5Players(User user) {

        if(user == null) {
            return null;
        }

        try{
            List<Recent> recentActivities = recentRepo.findTop5ByUser_IdOrderByTimestampDesc(user.getId());
            return recentActivities;
        }
        catch (Exception e){
            return null;
        }
    }
    
}
