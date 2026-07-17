package com.resumescreener.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "screening_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String candidateName;

    private Double matchScore;

    @ElementCollection
    private List<String> matchingSkills;

    @ElementCollection
    private List<String> missingSkills;

    @Column(length = 2000)
    private String verdict;

    private LocalDateTime createdAt = LocalDateTime.now();
}