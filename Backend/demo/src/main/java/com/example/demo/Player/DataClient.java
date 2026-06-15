package com.example.demo.Player;

import org.bson.Document;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Service;

// This class is responsible for fetching data from the MongoDB database. It implements the DataProvider interface, which defines the methods for searching players by name and selecting a player by ID. The DataClient class uses the MongoClient to interact with the database and retrieve the necessary information. The results are returned as a list of JSON strings, which can be easily consumed by the frontend application.
@Service
public class DataClient implements DataProvider {

    private final MongoClient mongoClient;

    public DataClient(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    /**
     * @param name The name of the player to search for.
     * @return A list of JSON strings representing the players that match the search criteria.
     */
    @Override
    public List<String> searchByName(String name) {
        Document regex = new Document("$regex", "^" + name).append("$options", "i");
        List<Document> ors = new ArrayList<>();
        ors.add(new Document("player.display_name", regex));

        FindIterable<Document> player = mongoClient.getDatabase("Football").getCollection("Players")
            .find(new Document("$or", ors))
            .limit(5);

        List<String> jsonList = convertToJSON(player);
        return jsonList;
    }

    /**
     * @param id The ID of the player to select.
     * @return A list of JSON strings representing the player that matches the ID.
     */
    @Override
    public List<String> selectedPlayer(String id) {
        FindIterable<Document> player = mongoClient.getDatabase("Football").getCollection("Players").find(new Document("player.player_id", id));
        List<String> jsonList = convertToJSON(player);
        return jsonList;
    }

    /**
     * Helper method to convert a FindIterable of Documents to a list of JSON strings.
     * @param documents
     * @return
     */
    private List<String> convertToJSON(FindIterable<Document> documents) {
        List<String> jsonList = new ArrayList<>();
        for (Document doc : documents) {
            jsonList.add(doc.toJson());
        }
        return jsonList;
    }

}
