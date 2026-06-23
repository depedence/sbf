package ru.sbf.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sbf.dto.response.MessageResponse;
import ru.sbf.entity.Account;
import ru.sbf.service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public Account createAccount(@RequestBody String name) {
        return accountService.createAccount(name);
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAccounts();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(new MessageResponse("Account successfully deleted"));
    }
}