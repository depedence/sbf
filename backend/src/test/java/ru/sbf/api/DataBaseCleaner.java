package ru.sbf.api;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.sbf.repository.AccountRepository;
import ru.sbf.repository.CategoryRepository;
import ru.sbf.repository.TransactionRepository;
import ru.sbf.repository.UserRepository;

@Component
public class DataBaseCleaner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    TransactionRepository transactionRepository;

    @Transactional
    public void cleanDb() {
        transactionRepository.deleteAll();
        categoryRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
    }
}