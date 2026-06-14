package com.example.demo.Player;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

// This class provides a singleton MongoClient instance to be used across the application
public class MongoClientProvider {
    private static MongoClient mongoClient;

    public static MongoClient getMongoClient() {
        if (mongoClient == null) {
            mongoClient = MongoClients.create("");
        }
        return mongoClient;
    }

    public static MongoDatabase getDatabase(String dbName) {
        return getMongoClient().getDatabase(dbName);
    }
}