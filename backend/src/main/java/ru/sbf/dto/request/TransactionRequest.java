package ru.sbf.dto.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionRequest {

    Long accountId;
    Long categoryId;
    double amount;
    String comment;
    LocalDateTime date;
}