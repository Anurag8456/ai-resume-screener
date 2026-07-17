package com.resumescreener.backend.repository;

import com.resumescreener.backend.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
}