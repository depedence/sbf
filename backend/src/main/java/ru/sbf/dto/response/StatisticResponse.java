package ru.sbf.dto.response;

import java.util.Map;

public record StatisticResponse(
        double totalIncome,
        double totalExpense,
        Map<String, Double> byCategory
) {}