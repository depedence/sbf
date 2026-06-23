package ru.sbf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sbf.entity.Transaction;
import ru.sbf.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findAllByUser(User user);

    List<Transaction> findAllByUserAndDateBetween(User user, LocalDateTime from, LocalDateTime to);
}