package com.example.demo.Player;

import java.util.List;
import java.util.ArrayList;

public class RB extends AbstractPlayer {

    public RB(List<String> playerData) {
        super(playerData);
    }

    @Override
    public List<String> getDetailedInfo() {
        List<String> info = new ArrayList<>();
        info.add(format("Name","Name"));
        info.add(format("Team","Team"));
        info.add(format("Position","Position"));
        info.add(format("Rushing Yards","RushYds"));
        info.add(format("Rushing TDs","RushTD"));
        info.add(format("Yards Per Carry","YPC"));
        info.add(format("Receptions","Rec"));
        info.add(format("Receiving Yards","RecYds"));
        info.add(format("Receiving TDs","RecTD"));
        info.add(format("Fumbles","Fumbles"));
        return info;
    }

    @Override
    public List<String> getCareerStats() {
        List<String> career = new ArrayList<>();
        career.add(format("Career Rushing Yards","CareerRushYds"));
        career.add(format("Career Rushing TDs","CareerRushTD"));
        career.add(format("Career Receptions","CareerRec"));
        career.add(format("Career Receiving Yards","CareerRecYds"));
        career.add(format("Career Fumbles","CareerFumbles"));
        return career;
    }
}
