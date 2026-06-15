package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

// This class is responsible for configuring the MongoDB client and database connection for the application. It defines two beans: one for the MongoClient, which is created using the connection URI specified in the application properties, and another for the MongoDatabase, which retrieves the "Football" database from the MongoClient. By defining these beans, we can easily inject the MongoClient and MongoDatabase into other components of the application that require access to the database, such as repositories or services.
@Configuration
public class MongoConfig {

    @Bean
    @Primary
    public MongoClient mongoClient(@Value("${spring.data.mongodb.uri}") String uri) {
        return MongoClients.create(uri);
    }

    @Bean
    public MongoDatabase mongoDatabase(MongoClient client) {
        return client.getDatabase("Football");
    }
}
