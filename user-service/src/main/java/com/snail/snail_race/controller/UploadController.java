package com.snail.snail_race.controller;

import com.snail.snail_race.dto.PresignedUrlRequest;
import com.snail.snail_race.dto.PresignedUrlResponse;
import com.snail.snail_race.service.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final S3Service s3Service;

    @PostMapping("/presigned-url")
    public ResponseEntity<PresignedUrlResponse> createPresignedUrl(
            @Valid @RequestBody PresignedUrlRequest request
    ) {
        PresignedUrlResponse response = s3Service.createPresignedUploadUrl(
                request.getFileName(),
                request.getContentType()
        );
        return ResponseEntity.ok(response);
    }
}
