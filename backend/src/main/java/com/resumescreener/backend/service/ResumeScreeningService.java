package com.resumescreener.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumescreener.backend.dto.MatchResultData;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class ResumeScreeningService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeScreeningService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Async
    public CompletableFuture<MatchResultData> runRufloScreeningSwarm(String resumeText, String jdText) {
        try {
            // STEP 1: Extractor Agent (Strict Data Extraction)
            String extractorSystem = "You are a strict data extractor. Read the provided resume text and extract the candidate's skills, experience, and education into a JSON format. Do not guess or infer any skills that are not explicitly written. Output ONLY the JSON.";
            String extractedJson = geminiService.callGemini(extractorSystem, "Extract from this resume:\n\n" + resumeText);

            // STEP 2: Verifier Agent (Anti-Hallucination Audit)
            String verifierSystem = "You are a strict auditor. I will give you a raw resume and a JSON list of extracted skills. Cross-reference every single skill in the JSON against the raw resume. If a skill is not explicitly mentioned in the raw text, delete it from the JSON. Output only the verified JSON.";
            String verifiedJson = geminiService.callGemini(verifierSystem, "Raw Resume:\n" + resumeText + "\n\nExtracted JSON:\n" + extractedJson);

            // STEP 3: Evaluator Agent (Scoring & Summary)
            String evaluatorSystem = "Compare the strictly verified JSON skills against the provided Job Description. Assign a match score from 0-100 based on explicit matches. Write a 2-sentence summary of why they match or fall short. Output the final result as a JSON object containing exact keys: candidateName, score, matchingSkills, missingSkills, experienceMet, verdict.";
            String evaluationPrompt = "Job Description:\n" + jdText + "\n\nVerified Candidate Data:\n" + verifiedJson;

            String finalRawResponse = geminiService.callGemini(evaluatorSystem, evaluationPrompt);

            // Clean markdown formatting if present
            String jsonResponse = finalRawResponse.replace("```json", "")
                    .replace("```", "")
                    .trim();

            // Map directly to your DTO
            MatchResultData finalResult = objectMapper.readValue(jsonResponse, MatchResultData.class);
            return CompletableFuture.completedFuture(finalResult);

        } catch (Exception e) {
            e.printStackTrace();
            return CompletableFuture.failedFuture(e);
        }
    }
}