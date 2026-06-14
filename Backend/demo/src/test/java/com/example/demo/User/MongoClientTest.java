package com.example.demo.User;

import com.example.demo.Player.MongoClientProvider;
import com.mongodb.client.MongoDatabase;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MongoClientTest {

    @Test
    public void testMongoClient() {

        MongoDatabase db = MongoClientProvider.getDatabase("Football");

        assertNotNull(db);
        assertNotNull(MongoClientProvider.getMongoClient());
    }
}
