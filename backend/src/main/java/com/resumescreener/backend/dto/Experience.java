package com.resumescreener.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class Experience {
    private String company;
    private String role;
    private String duration;
    private String description;
    private List<String> skillsUsed;
}