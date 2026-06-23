package ru.sbf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.sbf.entity.Category;
import ru.sbf.entity.User;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByUser(User user);

    Optional<Category> findByIdAndUser(Long id, User user);
}