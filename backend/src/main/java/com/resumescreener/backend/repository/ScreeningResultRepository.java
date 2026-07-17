package com.resumescreener.backend.repository;

import com.resumescreener.backend.model.ScreeningResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningResultRepository extends JpaRepository<ScreeningResult, Long> {
}