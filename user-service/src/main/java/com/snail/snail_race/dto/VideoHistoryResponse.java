package com.snail.snail_race.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VideoHistoryResponse {
    private Long video_id;
    private String type;
    private String status;
    private String file_name;
    private String url;
    private LocalDateTime created_at;
    private String final_verdict;
    private Float deepfake_score;
    private Float t2v_score;
}
