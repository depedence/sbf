package ru.sbf.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionModel {
    Long accountId;
    Long categoryId;
    double amount;
    String comment;
    LocalDateTime date;
}
