package ru.sbf.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sbf.dto.response.MessageResponse;
import ru.sbf.entity.Category;
import ru.sbf.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public Category createCategory(@RequestBody String name) {
        return categoryService.createCategory(name);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getCategories();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new MessageResponse("Category successfully deleted"));
    }
}