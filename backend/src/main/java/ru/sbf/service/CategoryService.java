package ru.sbf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sbf.entity.Category;
import ru.sbf.entity.User;
import ru.sbf.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public Category createCategory(String name) {
        User user = userService.getCurrentUser();

        Category category = new Category();
        category.setUser(user);
        category.setName(name);

        return categoryRepository.save(category);
    }

    public List<Category> getCategories() {
        User user = userService.getCurrentUser();

        return categoryRepository.findAllByUser(user);
    }

    public void deleteCategory(Long id) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }
}