package com.snail.snail_race.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PresignedUrlResponse {

    private String uploadUrl;
    private String fileUrl;
}
