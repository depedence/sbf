package ru.sbf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sbf.entity.Account;
import ru.sbf.entity.User;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findAllByUser(User user);

    Optional<Account> findByIdAndUser(Long id, User user);
}