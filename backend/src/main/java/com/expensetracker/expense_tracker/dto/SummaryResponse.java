package com.expensetracker.expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SummaryResponse {

    private String month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<CategoryBreakdown> categoryBreakdown;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CategoryBreakdown {
        private String categoryName;
        private String type;
        private BigDecimal total;
    }
}