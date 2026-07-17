package com.resumescreener.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class JobDescriptionData {
    private String role;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private Double minimumExperience;
    private List<String> educationRequirements;
    private List<String> responsibilities;
}