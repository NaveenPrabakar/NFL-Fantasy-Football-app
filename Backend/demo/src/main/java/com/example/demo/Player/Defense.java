package com.example.demo.Player;

import java.util.List;
import java.util.ArrayList;

public class Defense extends AbstractPlayer {

    public Defense(List<String> playerData) {
        super(playerData);
    }

    @Override
    public List<String> getDetailedInfo() {
        List<String> info = new ArrayList<>();
        info.add(format("Name","Name"));
        info.add(format("Team","Team"));
        info.add(format("Position","Position"));
        info.add(format("Tackles","Tackles"));
        info.add(format("Sacks","Sacks"));
        info.add(format("Interceptions","Ints"));
        info.add(format("Passes Defended","PD"));
        info.add(format("Forced Fumbles","FF"));
        info.add(format("Fumble Recoveries","FR"));
        return info;
    }

    @Override
    public List<String> getCareerStats() {
        List<String> career = new ArrayList<>();
        career.add(format("Career Tackles","CareerTackles"));
        career.add(format("Career Sacks","CareerSacks"));
        career.add(format("Career Interceptions","CareerInts"));
        career.add(format("Career Forced Fumbles","CareerFF"));
        return career;
    }
}
