package com.snail.snail_race.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PresignedUrlRequest {

    @NotBlank
    private String fileName;

    @NotBlank
    private String contentType;
}
