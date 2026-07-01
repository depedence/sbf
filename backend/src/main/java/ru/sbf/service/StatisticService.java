package ru.sbf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sbf.dto.response.StatisticResponse;
import ru.sbf.entity.Transaction;
import ru.sbf.entity.User;
import ru.sbf.repository.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final UserService userService;
    private final TransactionRepository transactionRepository;

    public StatisticResponse getStatistic(LocalDateTime from, LocalDateTime to) {
        User user = userService.getCurrentUser();

        List<Transaction> transactions = transactionRepository
                .findAllByUserAndDateBetween(user, from, to);

        double totalIncome = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Double> byCategory = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getName(),
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return new StatisticResponse(totalIncome, totalExpense, byCategory);
    }
}