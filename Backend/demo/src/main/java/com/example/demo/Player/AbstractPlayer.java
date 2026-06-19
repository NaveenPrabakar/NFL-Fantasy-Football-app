package com.example.demo.Player;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;

public abstract class AbstractPlayer {

    private List<String> playerData;
    protected final Map<String, String> stats = new HashMap<>();

    public AbstractPlayer(List<String> playerData) {
        this.playerData = playerData != null ? playerData : Collections.emptyList();
        parsePlayerData(this.playerData);
    }

    private void parsePlayerData(List<String> data) {
        for (String s : data) {
            if (s == null) continue;
            String trimmed = s.trim();
            // Expect key:value pairs when available, otherwise store by index
            if (trimmed.contains(":")) {
                int idx = trimmed.indexOf(":");
                String key = trimmed.substring(0, idx).trim();
                String val = trimmed.substring(idx + 1).trim();
                if (!key.isEmpty()) stats.put(key, val);
            }
        }
    }

    public List<String> getBasicInfo(){
        return new ArrayList<>(playerData);
    }

    /**
     * Safe getter for parsed stats. Returns "N/A" if not present.
     */
    protected String stat(String key) {
        return stats.getOrDefault(key, "N/A");
    }

    protected String format(String label, String key) {
        return label + ": " + stat(key);
    }

    public abstract List<String> getDetailedInfo();

    public abstract List<String> getCareerStats();
}
