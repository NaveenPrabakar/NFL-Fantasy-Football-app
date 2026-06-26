package com.example.demo.Recent;
import com.example.demo.User.User;
import java.util.List;

public interface RecentController {
    boolean addLatestPlayer(User user, String searchedPlayer);
    List<Recent> getLast5Players(User user);
}
