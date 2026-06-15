package com.example.demo.User;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MongoClientTest {

    @Autowired
    private MongoClient mongoClient;

    @Test
    public void testMongoClient() {
        assertNotNull(mongoClient);

        MongoDatabase db = mongoClient.getDatabase("Football");
        assertNotNull(db);
    }
}
