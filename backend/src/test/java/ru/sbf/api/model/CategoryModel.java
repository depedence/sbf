package ru.sbf.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.sbf.entity.Transaction;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryModel {
    String name;
    Transaction.TransactionType type;
}