package com.resumescreener.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumescreener.backend.dto.JobDescriptionData;
import com.resumescreener.backend.dto.MatchResultData;
import com.resumescreener.backend.dto.ResumeData;
import org.springframework.stereotype.Service;

@Service
public class ResumeScreeningService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeScreeningService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public ResumeData parseResume(String resumeText) throws Exception {
        String systemPrompt = """
                You are an expert resume parser.
                Extract information from the resume based on its meaning,
                not only based on exact section headings.
                Return ONLY valid JSON with these fields:
                name, email, phone, totalExperienceYears, skills (array of strings),
                experiences (array of objects with company, role, duration, description, skillsUsed),
                education (array of strings), projects (array of strings), certifications (array of strings).
                Rules:
                1. Do not invent information.
                2. If a value is not available, return null.
                3. If a list has no information, return an empty list.
                4. Include internships inside experiences.
                """;

        String userPrompt = "Parse the following resume:\n\n" + resumeText;

        String jsonResponse = geminiService.callGemini(systemPrompt, userPrompt);
        return objectMapper.readValue(jsonResponse, ResumeData.class);
    }

    public JobDescriptionData parseJobDescription(String jdText) throws Exception {
        String systemPrompt = """
                You are an expert HR assistant.
                Analyze job descriptions and extract structured information.
                Return ONLY valid JSON with these fields:
                role, requiredSkills (array of strings), preferredSkills (array of strings),
                minimumExperience (number or null), educationRequirements (array of strings),
                responsibilities (array of strings).
                If minimum experience is not mentioned, return null.
                If information for a list is missing, return an empty list.
                Do not invent information.
                """;

        String userPrompt = "Analyze the following job description:\n\n" + jdText;

        String jsonResponse = geminiService.callGemini(systemPrompt, userPrompt);
        return objectMapper.readValue(jsonResponse, JobDescriptionData.class);
    }

    public MatchResultData scoreMatch(JobDescriptionData job, ResumeData resume) throws Exception {
        String prompt = """
                You are an HR recruiter.
                Compare the candidate's resume with the job description.

                JOB DESCRIPTION:
                %s

                CANDIDATE RESUME:
                %s

                Return ONLY valid JSON with these fields:
                candidateName, score (0 to 100), matchingSkills (array of strings),
                missingSkills (array of strings), experienceMet (true/false), verdict (short string).
                Keep the verdict concise and easy to read.
                """.formatted(
                objectMapper.writeValueAsString(job),
                objectMapper.writeValueAsString(resume)
        );

        String jsonResponse = geminiService.callGemini("", prompt);
        return objectMapper.readValue(jsonResponse, MatchResultData.class);
    }
}