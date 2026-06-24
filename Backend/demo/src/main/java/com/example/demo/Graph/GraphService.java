package com.example.demo.Graph;

import org.springframework.http.ResponseEntity;

public interface GraphService {
    ResponseEntity<byte[]> getGraphImage(String position, String metric, String player);
}
