package com.example.demo.Player;
import java.util.List;
import java.util.ArrayList;

public class QB extends AbstractPlayer {

    public QB(List<String> playerData) {
        super(playerData);
    }

    @Override
    public List<String> getDetailedInfo() {
        List<String> info = new ArrayList<>();
        info.add(format("Name","Name"));
        info.add(format("Team","Team"));
        info.add(format("Position","Position"));
        info.add(format("Passing Yards","PassYds"));
        info.add(format("Passing TDs","PassTD"));
        info.add(format("Interceptions","Int"));
        info.add(format("Completion %","CompPct"));
        info.add(format("Passer Rating","PasserRating"));
        info.add(format("Rushing Yards","RushYds"));
        info.add(format("Rushing TDs","RushTD"));
        return info;
    }

    @Override
    public List<String> getCareerStats() {
        List<String> career = new ArrayList<>();
        career.add(format("Career Passing Yards","CareerPassYds"));
        career.add(format("Career Passing TDs","CareerPassTD"));
        career.add(format("Career Interceptions","CareerInt"));
        career.add(format("Career Completion %","CareerCompPct"));
        career.add(format("Career Passer Rating","CareerPasserRating"));
        career.add(format("Career Rushing Yards","CareerRushYds"));
        career.add(format("Career Rushing TDs","CareerRushTD"));
        return career;
    }
    
}
