package com.snail.snail_race.service;

import com.snail.snail_race.dto.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${spring.cloud.aws.region.static}")
    private String region;

    @Value("${app.s3.base-folder}")
    private String baseFolder;

    @Value("${app.s3.presigned-url-expiration-minutes:10}")
    private long presignedUrlExpirationMinutes;

    public String uploadFile(MultipartFile file) {
        try {
            String key = createFileKey(file.getOriginalFilename());

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            return buildFileUrl(key);

        } catch (IOException e) {
            throw new RuntimeException("S3 file upload failed", e);
        }
    }

    public PresignedUrlResponse createPresignedUploadUrl(String originalFilename, String contentType) {
        String key = createFileKey(originalFilename);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignedUrlExpirationMinutes))
                .putObjectRequest(putObjectRequest)
                .build();

        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .build()) {
            String uploadUrl = presigner.presignPutObject(presignRequest)
                    .url()
                    .toString();

            return new PresignedUrlResponse(forceHttps(uploadUrl), buildFileUrl(key));
        }
    }

    private String createFileKey(String originalFilename) {
        String time = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String uuid = UUID.randomUUID().toString();

        return baseFolder + "/" + time + "_" + uuid + "_" + sanitizeFilename(originalFilename);
    }

    private String sanitizeFilename(String originalFilename) {
        String filename = originalFilename == null || originalFilename.isBlank()
                ? "upload"
                : originalFilename.replace("\\", "/");
        filename = filename.substring(filename.lastIndexOf('/') + 1);
        return URLEncoder.encode(filename, StandardCharsets.UTF_8)
                .replace("+", "%20");
    }

    private String buildFileUrl(String key) {
        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    private String forceHttps(String url) {
        if (url != null && url.startsWith("http://")) {
            return "https://" + url.substring("http://".length());
        }
        return url;
    }
}
