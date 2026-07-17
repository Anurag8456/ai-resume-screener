package com.resumescreener.backend.controller;

import com.resumescreener.backend.dto.ResumeData;
import com.resumescreener.backend.service.ResumeParserService;
import com.resumescreener.backend.service.ResumeScreeningService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class TestController {

    private final ResumeParserService resumeParserService;
    private final ResumeScreeningService resumeScreeningService;

    public TestController(ResumeParserService resumeParserService,
                          ResumeScreeningService resumeScreeningService) {
        this.resumeParserService = resumeParserService;
        this.resumeScreeningService = resumeScreeningService;
    }

    @PostMapping("/test-parse")
    public String testParse(@RequestParam("file") MultipartFile file) throws Exception {
        return resumeParserService.extractText(file);
    }

    @PostMapping("/test-gemini")
    public ResumeData testGemini(@RequestParam("file") MultipartFile file) throws Exception {
        String text = resumeParserService.extractText(file);
        return resumeScreeningService.parseResume(text);
    }
}