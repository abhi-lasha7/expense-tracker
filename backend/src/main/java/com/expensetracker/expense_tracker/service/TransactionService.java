package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.dto.TransactionRequest;
import com.expensetracker.expense_tracker.dto.TransactionResponse;
import com.expensetracker.expense_tracker.entity.Category;
import com.expensetracker.expense_tracker.entity.Transaction;
import com.expensetracker.expense_tracker.entity.User;
import com.expensetracker.expense_tracker.exception.ResourceNotFoundException;
import com.expensetracker.expense_tracker.repository.CategoryRepository;
import com.expensetracker.expense_tracker.repository.TransactionRepository;
import com.expensetracker.expense_tracker.repository.UserRepository;
import com.expensetracker.expense_tracker.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public TransactionResponse createTransaction(TransactionRequest request) {
      User currentUser = getCurrentUser();
      Category category = categoryRepository.findByIdAndUserId(request.getCategoryId(), currentUser.getId())
        .orElseThrow(() -> new ResourceNotFoundException(
                "Category not found with id: " + request.getCategoryId()));
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);
        transaction.setUser(getCurrentUser());

        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }

    public List<TransactionResponse> getAllTransactions() {
        User currentUser = getCurrentUser();
        return transactionRepository.findByUserId(currentUser.getId())
                .stream()
                .map(TransactionResponse::fromEntity)
                .toList();
    }

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getEmail().equals(SecurityUtils.getCurrentUserEmail())) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id); // don't leak existence
        }

        return TransactionResponse.fromEntity(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getEmail().equals(SecurityUtils.getCurrentUserEmail())) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id);
        }

        transactionRepository.deleteById(id);
    }
}