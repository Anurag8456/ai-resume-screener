package com.resumescreener.backend.controller;

import com.resumescreener.backend.dto.JobDescriptionData;
import com.resumescreener.backend.dto.MatchResultData;
import com.resumescreener.backend.dto.ResumeData;
import com.resumescreener.backend.model.ScreeningResult;
import com.resumescreener.backend.repository.ScreeningResultRepository;
import com.resumescreener.backend.service.ResumeParserService;
import com.resumescreener.backend.service.ResumeScreeningService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ScreeningController {

    private final ResumeParserService resumeParserService;
    private final ResumeScreeningService resumeScreeningService;
    private final ScreeningResultRepository screeningResultRepository;

    public ScreeningController(ResumeParserService resumeParserService,
                               ResumeScreeningService resumeScreeningService,
                               ScreeningResultRepository screeningResultRepository) {
        this.resumeParserService = resumeParserService;
        this.resumeScreeningService = resumeScreeningService;
        this.screeningResultRepository = screeningResultRepository;
    }

    @PostMapping("/screen")
    public MatchResultData screenResume(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescriptionText
    ) throws Exception {

        // Step 1: extract plain text from the uploaded resume file
        String resumeText = resumeParserService.extractText(resumeFile);

        // Step 2: ask Gemini to turn resume text into structured data
        ResumeData resumeData = resumeScreeningService.parseResume(resumeText);

        // Step 3: ask Gemini to turn the job description text into structured data
        JobDescriptionData jobData = resumeScreeningService.parseJobDescription(jobDescriptionText);

        // Step 4: ask Gemini to compare the two and produce a score
        MatchResultData matchResult = resumeScreeningService.scoreMatch(jobData, resumeData);

        // Step 5: save the result to the database
        ScreeningResult entity = new ScreeningResult();
        entity.setCandidateName(matchResult.getCandidateName());
        entity.setMatchScore(matchResult.getScore());
        entity.setMatchingSkills(matchResult.getMatchingSkills());
        entity.setMissingSkills(matchResult.getMissingSkills());
        entity.setVerdict(matchResult.getVerdict());
        entity.setCreatedAt(LocalDateTime.now());
        screeningResultRepository.save(entity);

        // Step 6: return the result to whoever called this endpoint (the frontend, later)
        return matchResult;
    }

    @GetMapping("/results")
    public List<ScreeningResult> getAllResults() {
        return screeningResultRepository.findAll();
    }
}