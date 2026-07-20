package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.dto.SummaryResponse;
import com.expensetracker.expense_tracker.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final SummaryService summaryService;

    @GetMapping
    public SummaryResponse getMonthlySummary(@RequestParam String month) {
        return summaryService.getMonthlySummary(month);
    }
}