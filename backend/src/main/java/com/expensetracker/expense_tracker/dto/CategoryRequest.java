package com.expensetracker.expense_tracker.dto;

import com.expensetracker.expense_tracker.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    @NotNull(message = "Type is required (INCOME or EXPENSE)")
    private Category.CategoryType type;
}