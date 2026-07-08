package com.snail.snail_race.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class AiAnalysisResponse {
    private String request_id;
    private String decision;
    private Double score;
    private Double threshold;
    private List<DeepfakeModelDto> models;
    private DeepfakeEvidenceDto evidence;
    private Integer latency_ms;
    private Double rgb_contribution;
    private Double freq_contribution;
    private List<Object> top_regions;
    private String forensic_report;
    private String original_face_url;
    private List<Double> per_frame_probs;
    private List<Object> suspicious_frames;
}
