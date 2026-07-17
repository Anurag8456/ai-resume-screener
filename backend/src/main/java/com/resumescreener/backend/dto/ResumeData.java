package com.resumescreener.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ResumeData {
    private String name;
    private String email;
    private String phone;
    private Double totalExperienceYears;
    private List<String> skills;
    private List<Experience> experiences;
    private List<String> education;
    private List<String> projects;
    private List<String> certifications;
}