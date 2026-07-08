package com.snail.snail_race.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class XaiProxyController {

    @Value("${ai.server.base-url}")
    private String aiServerBaseUrl;

    @GetMapping("/api/ai/xai-image")
    public ResponseEntity<byte[]> proxyXaiImage(@RequestParam String path) {
        try {
            RestClient client = RestClient.create();
            String encodedPath = URLEncoder.encode(path, StandardCharsets.UTF_8);
            byte[] imageBytes = client.get()
                    .uri(URI.create(aiServerBaseUrl + "/api/xai-image?path=" + encodedPath))
                    .retrieve()
                    .body(byte[].class);
            String ext = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1).toLowerCase() : "png";
            MediaType mediaType = ext.equals("png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;
            return ResponseEntity.ok().contentType(mediaType).body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
}
