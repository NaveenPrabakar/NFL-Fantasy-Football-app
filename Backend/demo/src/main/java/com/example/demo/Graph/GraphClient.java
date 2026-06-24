package com.example.demo.Graph;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GraphClient implements GraphService {

    private final RestTemplate restTemplate;
    private final String graphApiBaseUrl;

    public GraphClient(@Value("${graph.api.base-url}") String graphApiBaseUrl) {
        this.restTemplate = new RestTemplate();
        this.graphApiBaseUrl = graphApiBaseUrl;
    }

    @Override
    public ResponseEntity<byte[]> getGraphImage(String position, String metric, String player) {
        URI uri = UriComponentsBuilder.fromUriString(graphApiBaseUrl)
            .pathSegment(position, metric, "image")
            .queryParam("player", player)
            .encode()
            .build()
            .toUri();

        try {
            ResponseEntity<byte[]> response = restTemplate.getForEntity(uri, byte[].class);
            return ResponseEntity.status(response.getStatusCode())
                .contentType(MediaType.IMAGE_PNG)
                .body(response.getBody());
                
        } catch (HttpStatusCodeException ex) {
            
            return ResponseEntity.status(ex.getStatusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(ex.getResponseBodyAsByteArray());
        }
    }
}
