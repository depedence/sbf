package ru.sbf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sbf.entity.Account;
import ru.sbf.entity.User;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUser(User user);
}