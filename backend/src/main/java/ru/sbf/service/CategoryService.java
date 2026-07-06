package ru.sbf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sbf.dto.request.CategoryRequest;
import ru.sbf.entity.Category;
import ru.sbf.entity.User;
import ru.sbf.exception.AppException;
import ru.sbf.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public Category createCategory(CategoryRequest request) {
        User user = userService.getCurrentUser();

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getType() == null) {
            throw new IllegalArgumentException("Type is required");
        }

        Category category = new Category();
        category.setUser(user);
        category.setName(request.getName());
        category.setType(request.getType());

        return categoryRepository.save(category);
    }

    public List<Category> getCategories() {
        User user = userService.getCurrentUser();

        return categoryRepository.findAllByUser(user);
    }

    public void deleteCategory(Long id) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AppException.NotFoundException("Category not found"));
        categoryRepository.delete(category);
    }
}