package com.resumescreener.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class ResumeParserService {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();

        if (filename == null) {
            throw new IllegalArgumentException("File has no name");
        }

        String lowerName = filename.toLowerCase();

        if (lowerName.endsWith(".pdf")) {
            return extractFromPdf(file);
        } else if (lowerName.endsWith(".docx")) {
            return extractFromDocx(file);
        } else {
            throw new IllegalArgumentException("Unsupported file type. Please upload a .pdf or .docx file.");
        }
    }

    private String extractFromPdf(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromDocx(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            return extractor.getText();
        }
    }
}