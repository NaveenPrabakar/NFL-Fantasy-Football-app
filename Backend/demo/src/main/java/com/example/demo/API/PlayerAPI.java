package com.example.demo.API;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.Player.DataProvider;
import java.util.List;

@RestController
@RequestMapping("/player")
public class PlayerAPI {

    private final DataProvider dataProvider;

    public PlayerAPI(DataProvider dataProvider) {
        this.dataProvider = dataProvider;
    }

    @GetMapping("/search")
    public List<String> searchPlayerByName(@RequestParam String name) {
        return dataProvider.searchByName(name);
    }

    @GetMapping("/selected")
    public List<String> getSelectedPlayer(@RequestParam String id) {
        return dataProvider.selectedPlayer(id);
    }
}