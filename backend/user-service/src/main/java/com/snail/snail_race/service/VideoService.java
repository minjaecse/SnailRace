package com.snail.snail_race.service;

import com.snail.snail_race.domain.Video;
import com.snail.snail_race.domain.Result;
import com.snail.snail_race.dto.VideoHistoryResponse;
import com.snail.snail_race.dto.VideoUploadResponse;
import com.snail.snail_race.exception.VideoNotFoundException;
import com.snail.snail_race.repository.ResultRepository;
import com.snail.snail_race.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VideoService {

    private final VideoRepository videoRepository;
    private final ResultRepository resultRepository;
    private final S3Service s3Service;
    private final AiAnalysisService aiAnalysisService;

    public VideoUploadResponse uploadVideo(Long userId, String type, MultipartFile file) {
        String analysisType = normalizeAnalysisType(type);
        String fileUrl = s3Service.uploadFile(file);

        Video video = new Video();
        video.setUserId(userId);
        video.setFileName(file.getOriginalFilename());
        video.setFilePath(fileUrl);
        video.setUrl(fileUrl);
        video.setType(analysisType);
        video.setStatus("PENDING");

        Video savedVideo = videoRepository.save(video);
        VideoUploadResponse response = new VideoUploadResponse(savedVideo.getId(), savedVideo.getStatus());

        triggerAnalysis(savedVideo, fileUrl, analysisType);
        return response;
    }

    public VideoUploadResponse saveVideoUrl(Long userId, String url, String type) {
        String analysisType = normalizeAnalysisType(type);

        Video video = new Video();
        video.setUserId(userId);
        video.setFileName(null);
        video.setFilePath(url);
        video.setUrl(url);
        video.setType(analysisType);
        video.setStatus("PENDING");

        Video savedVideo = videoRepository.save(video);
        VideoUploadResponse response = new VideoUploadResponse(savedVideo.getId(), savedVideo.getStatus());

        triggerAnalysis(savedVideo, url, analysisType);
        return response;
    }

    private void triggerAnalysis(Video video, String videoUrl, String type) {
        log.info("[VIDEO] Triggering analysis: videoId={}, type={}, videoUrl={}",
                video.getId(), type, videoUrl);

        if ("DEEPFAKE".equalsIgnoreCase(type)) {
            aiAnalysisService.requestDeepfakeAnalysis(video, videoUrl);
        } else if ("T2V".equalsIgnoreCase(type)) {
            aiAnalysisService.requestT2vAnalysis(video, videoUrl);
        }
    }

    private String normalizeAnalysisType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Video analysis type is required. Allowed values: DEEPFAKE, T2V");
        }

        String normalizedType = type.trim().toUpperCase();
        if (!"DEEPFAKE".equals(normalizedType) && !"T2V".equals(normalizedType)) {
            throw new IllegalArgumentException("Unsupported video analysis type: " + type
                    + ". Allowed values: DEEPFAKE, T2V");
        }
        return normalizedType;
    }

    @Transactional(readOnly = true)
    public VideoUploadResponse getVideoStatus(Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new VideoNotFoundException(videoId));
        return new VideoUploadResponse(video.getId(), video.getStatus());
    }

    @Transactional(readOnly = true)
    public List<VideoHistoryResponse> getMyVideoHistory(Long userId) {
        return videoRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toVideoHistoryResponse)
                .toList();
    }

    private VideoHistoryResponse toVideoHistoryResponse(Video video) {
        Result result = resultRepository.findByVideo_Id(video.getId()).orElse(null);

        return new VideoHistoryResponse(
                video.getId(),
                video.getType(),
                video.getStatus(),
                video.getFileName(),
                video.getUrl(),
                video.getCreatedAt(),
                result != null ? result.getFinalVerdict() : null,
                result != null ? result.getDeepfakeScore() : null,
                result != null ? result.getT2vScore() : null
        );
    }
}
