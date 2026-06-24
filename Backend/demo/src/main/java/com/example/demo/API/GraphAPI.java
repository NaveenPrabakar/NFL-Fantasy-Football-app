package com.example.demo.API;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Graph.GraphService;

@RestController
@RequestMapping("/graph")
public class GraphAPI {

    private final GraphService graphService;

    public GraphAPI(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping(value = "/{position}/{metric}/image", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getGraphImage(@PathVariable String position, @PathVariable String metric, @RequestParam String player) {
        return graphService.getGraphImage(position, metric, player);
    }
}
