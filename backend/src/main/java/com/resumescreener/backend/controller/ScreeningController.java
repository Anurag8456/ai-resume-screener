package com.resumescreener.backend.controller;

import com.resumescreener.backend.dto.MatchResultData;
import com.resumescreener.backend.model.ScreeningResult;
import com.resumescreener.backend.repository.ScreeningResultRepository;
import com.resumescreener.backend.service.ResumeParserService;
import com.resumescreener.backend.service.ResumeScreeningService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Helps prevent CORS errors from your React frontend
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
    public CompletableFuture<MatchResultData> screenResume(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescriptionText
    ) throws Exception {

        // Step 1: Extract plain text from the uploaded resume file
        String resumeText = resumeParserService.extractText(resumeFile);

        // Step 2 & 3 & 4: Let Ruflo Swarm handle extraction, verification, and scoring asynchronously
        return resumeScreeningService.runRufloScreeningSwarm(resumeText, jobDescriptionText)
                .thenApply(matchResult -> {
                    // Step 5: Save the result to the database AFTER the swarm finishes
                    ScreeningResult entity = new ScreeningResult();
                    entity.setCandidateName(matchResult.getCandidateName());
                    entity.setMatchScore(matchResult.getScore());
                    entity.setMatchingSkills(matchResult.getMatchingSkills());
                    entity.setMissingSkills(matchResult.getMissingSkills());
                    entity.setVerdict(matchResult.getVerdict());
                    entity.setCreatedAt(LocalDateTime.now());
                    screeningResultRepository.save(entity);

                    // Step 6: Return the result to the React frontend
                    return matchResult;
                });
    }

    @GetMapping("/results")
    public List<ScreeningResult> getAllResults() {
        return screeningResultRepository.findAll();
    }
}