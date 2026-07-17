package com.resumescreener.backend.controller;

import com.resumescreener.backend.service.ResumeParserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class TestController {

    private final ResumeParserService resumeParserService;

    public TestController(ResumeParserService resumeParserService) {
        this.resumeParserService = resumeParserService;
    }

    @PostMapping("/test-parse")
    public String testParse(@RequestParam("file") MultipartFile file) throws IOException {
        return resumeParserService.extractText(file);
    }
}