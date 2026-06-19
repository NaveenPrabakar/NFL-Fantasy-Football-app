package com.example.demo.Player;

import java.util.List;
import java.util.ArrayList;

public class Kicker extends AbstractPlayer {

    public Kicker(List<String> playerData) {
        super(playerData);
    }

    @Override
    public List<String> getDetailedInfo() {
        List<String> info = new ArrayList<>();
        info.add(format("Name","Name"));
        info.add(format("Team","Team"));
        info.add(format("Position","Position"));
        info.add(format("Field Goals Made","FGMade"));
        info.add(format("Field Goals Attempted","FGA"));
        info.add(format("Field Goal %","FGPct"));
        info.add(format("Longest Field Goal","LongFG"));
        info.add(format("Extra Points Made","XPMade"));
        info.add(format("Extra Points Attempted","XPA"));
        return info;
    }

    @Override
    public List<String> getCareerStats() {
        List<String> career = new ArrayList<>();
        career.add(format("Career Field Goals Made","CareerFGMade"));
        career.add(format("Career Field Goals Attempted","CareerFGA"));
        career.add(format("Career Field Goal %","CareerFGPct"));
        career.add(format("Career Extra Points Made","CareerXPMade"));
        return career;
    }
}
