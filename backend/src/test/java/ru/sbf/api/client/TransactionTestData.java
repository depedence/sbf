package ru.sbf.api.client;

import lombok.Builder;
import lombok.Data;
import ru.sbf.api.model.CategoryModel;

@Data
@Builder
public class TransactionTestData {
    private String accountName;
    private CategoryModel categoryModel;
    private double amount;
    private String comment;
}
