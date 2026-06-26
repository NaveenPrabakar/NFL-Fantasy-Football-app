package com.example.demo.API;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Recent.RecentController;
import com.example.demo.Recent.Recent;
import com.example.demo.User.User;

@RestController
@RequestMapping("/recent")
public class RecentAPI {
    
    private final RecentController recentController;

    public RecentAPI(RecentController recentController) {
        this.recentController = recentController;
    }

    @PostMapping("/add")
    public boolean addLatestPlayer(@RequestBody User user, @RequestParam String searchedPlayer) {
        return recentController.addLatestPlayer(user, searchedPlayer);
    }

    @GetMapping("/latest/{userId}")
    public List<Recent> getLast5Players(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return recentController.getLast5Players(user);
    }
}
