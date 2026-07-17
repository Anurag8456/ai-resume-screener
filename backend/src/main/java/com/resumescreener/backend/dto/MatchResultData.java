package com.resumescreener.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MatchResultData {
    private String candidateName;
    private Double score;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private Boolean experienceMet;
    private String verdict;
}