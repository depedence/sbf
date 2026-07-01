package ru.sbf.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sbf.dto.request.TransactionRequest;
import ru.sbf.entity.Account;
import ru.sbf.entity.Category;
import ru.sbf.entity.Transaction;
import ru.sbf.entity.User;
import ru.sbf.exception.AppException;
import ru.sbf.repository.AccountRepository;
import ru.sbf.repository.CategoryRepository;
import ru.sbf.repository.TransactionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    @Transactional
    public Transaction createTransaction(TransactionRequest request) {
        User user = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(request.getAccountId(), user)
                .orElseThrow(() -> new AppException.NotFoundException("Account not found"));
        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new AppException.NotFoundException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setType(category.getType());
        transaction.setAmount(request.getAmount());
        transaction.setComment(request.getComment());
        transaction.setDate(request.getDate());

        if (category.getType() == Transaction.TransactionType.INCOME) {
            account.setBalance(account.getBalance() + request.getAmount());
        } else {
            account.setBalance(account.getBalance() - request.getAmount());
        }

        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactions() {
        return transactionRepository.findAllByUser(userService.getCurrentUser());
    }

    public void deleteTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new AppException.NotFoundException("Transaction not found"));

        User currentUser = userService.getCurrentUser();

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new AppException.AccessDeniedException("Access denied");
        }

        Account account = transaction.getAccount();

        if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            account.setBalance(account.getBalance() + transaction.getAmount());
        } else {
            account.setBalance(account.getBalance() - transaction.getAmount());
        }

        accountRepository.save(account);
        transactionRepository.delete(transaction);
    }
}