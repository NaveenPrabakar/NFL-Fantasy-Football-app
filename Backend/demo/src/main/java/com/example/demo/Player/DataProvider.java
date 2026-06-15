package com.example.demo.Player;
import java.util.List;

// This interface defines the methods for fetching player data from the MongoDB database. It includes methods for searching players by name and selecting a player by ID. The DataClient class implements this interface to provide the actual functionality for retrieving data from the database.
public interface DataProvider{
    List<String> searchByName(String name);
    List<String> selectedPlayer(String id);
}