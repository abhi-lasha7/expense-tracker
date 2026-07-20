package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.dto.SummaryResponse;
import com.expensetracker.expense_tracker.entity.Transaction;
import com.expensetracker.expense_tracker.entity.User;
import com.expensetracker.expense_tracker.exception.ResourceNotFoundException;
import com.expensetracker.expense_tracker.repository.TransactionRepository;
import com.expensetracker.expense_tracker.repository.UserRepository;
import com.expensetracker.expense_tracker.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public SummaryResponse getMonthlySummary(String monthParam) {
        User currentUser = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        YearMonth yearMonth = YearMonth.parse(monthParam); // expects "2026-07"
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetween(currentUser.getId(), startDate, endDate);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getCategory().getType() == com.expensetracker.expense_tracker.entity.Category.CategoryType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getCategory().getType() == com.expensetracker.expense_tracker.entity.Category.CategoryType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, List<Transaction>> groupedByCategory = transactions.stream()
                .collect(Collectors.groupingBy(t -> t.getCategory().getName()));

        List<SummaryResponse.CategoryBreakdown> breakdown = groupedByCategory.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<Transaction> categoryTransactions = entry.getValue();
                    BigDecimal categoryTotal = categoryTransactions.stream()
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    String type = categoryTransactions.get(0).getCategory().getType().name();
                    return new SummaryResponse.CategoryBreakdown(categoryName, type, categoryTotal);
                })
                .collect(Collectors.toList());

        return new SummaryResponse(monthParam, totalIncome, totalExpense, balance, breakdown);
    }
}