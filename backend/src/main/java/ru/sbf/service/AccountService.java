package ru.sbf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sbf.entity.Account;
import ru.sbf.entity.User;
import ru.sbf.repository.AccountRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;

    public Account createAccount(String name) {
        User user = userService.getCurrentUser();

        Account account = new Account();
        account.setUser(user);
        account.setName(name);
        account.setBalance(0);

        return accountRepository.save(account);
    }

    public List<Account> getAccounts() {
        return accountRepository.findAllByUser(userService.getCurrentUser());
    }

    public void deleteAccount(Long id) {
        User user = userService.getCurrentUser();
        Account account = accountRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
    }
}